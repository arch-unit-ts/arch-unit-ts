import { Optional } from '../../common/domain/Optional';
import { Assert } from '../../error/domain/Assert';
import { classes } from '../../main';
import { DescribedPredicate } from '../base/DescribedPredicate';
import { Formatters } from '../core/domain/Formatters';
import { Dependency, Functions, Predicates, TypeScriptClass, TypeScriptClasses } from '../core/domain/TypeScriptClass';
import { ArchCondition } from '../lang/ArchCondition';
import { ArchRule } from '../lang/ArchRule';
import { ConditionEvents } from '../lang/ConditionEvents';
import { ArchConditions } from '../lang/conditions/ArchConditions';
import { EvaluationResult } from '../lang/EvaluationResult';
import { SimpleConditionEvent } from '../lang/SimpleConditionEvent';
import { SimpleConditionEvents } from '../lang/SimpleConditionEvents';

export abstract class Architectures {
  public static layeredArchitecture(): DependencySettings {
    return DependencySettings.default();
  }
}

class DependencySettings {
  private readonly description: Optional<string>;
  readonly ignoreExcludedDependencies: (predicate: DescribedPredicate<Dependency>) => DescribedPredicate<Dependency>;

  private constructor(
    description: string,
    ignoreExludedDependencies: (predicate: DescribedPredicate<Dependency>) => DescribedPredicate<Dependency>
  ) {
    this.description = Optional.ofUndefinable(description);
    this.ignoreExcludedDependencies = ignoreExludedDependencies;
  }

  static default(): DependencySettings {
    return new DependencySettings(undefined, undefined);
  }

  public consideringOnlyDependenciesInAnyPackage(...packageIdentifiers: string[]): LayeredArchitecture {
    return LayeredArchitecture.fromDependencySettings(this.setToConsideringOnlyDependenciesInAnyPackage(...packageIdentifiers));
  }

  getDescription() {
    return this.description.orElse('');
  }

  private setToConsideringOnlyDependenciesInAnyPackage(...packageIdentifiers: string[]): DependencySettings {
    const outsideOfRelevantPackage: DescribedPredicate<TypeScriptClass> = TypeScriptClass.resideOutsideOfPackages(...packageIdentifiers);

    return new DependencySettings(
      `considering only dependencies in any package [${Formatters.joinSingleQuoted(...packageIdentifiers)}]`,
      (predicate: DescribedPredicate<Dependency>) => predicate.or(this.originOrTargetIs(outsideOfRelevantPackage))
    );
  }

  private originOrTargetIs(predicate: DescribedPredicate<TypeScriptClass>): DescribedPredicate<Dependency> {
    return Functions.GET_ORIGIN_CLASS.is(predicate).or(Functions.GET_TARGET_CLASS.is(predicate));
  }
}

class LayeredArchitecture implements ArchRule {
  private readonly layerDefinitions: LayerDefinitions;
  private readonly dependencySpecifications: Set<LayerDependencySpecification>;
  private readonly dependencySettings: DependencySettings;
  private overriddenDescription: Optional<string>;
  private readonly optionalLayers: boolean;

  private constructor(
    layerDefinitions: LayerDefinitions,
    dependencySpecifications: Set<LayerDependencySpecification>,
    dependencySettings: DependencySettings,
    overriddenDescription: Optional<string>,
    optionalLayers: boolean
  ) {
    this.layerDefinitions = layerDefinitions;
    this.dependencySpecifications = dependencySpecifications;
    this.dependencySettings = dependencySettings;
    this.overriddenDescription = overriddenDescription;
    this.optionalLayers = optionalLayers;
  }

  static fromDependencySettings(dependencySettings: DependencySettings): LayeredArchitecture {
    return new LayeredArchitecture(
      new LayerDefinitions(),
      new Set<LayerDependencySpecification>(),
      dependencySettings,
      Optional.empty(),
      false
    );
  }

  public withOptionalLayers(optionalLayers: boolean): LayeredArchitecture {
    return new LayeredArchitecture(
      this.layerDefinitions,
      this.dependencySpecifications,
      this.dependencySettings,
      this.overriddenDescription,
      optionalLayers
    );
  }

  because(reason: string): ArchRule {
    this.overriddenDescription = Optional.ofUndefinable(`${this.getDescription()} because ${reason}`);
    return this;
  }

  check(classes: TypeScriptClasses): void {
    const evaluationResult = this.evaluate(classes);
    if (evaluationResult.hasErrors()) {
      throw new Error(`Architecture violation : Rule ${this.getDescription()}.\nErrors : ${evaluationResult.violationReport()}`);
    }
  }

  evaluate(classes: TypeScriptClasses): EvaluationResult {
    const conditionEvents: ConditionEvents = new SimpleConditionEvents();

    const result: EvaluationResult = new EvaluationResult(conditionEvents);
    this.checkEmptyLayers(classes, result);

    this.dependencySpecifications.forEach(specification => result.add(this.evaluateDependenciesShouldBeSatisfied(classes, specification)));

    return result;
  }

  private checkEmptyLayers(classes: TypeScriptClasses, result: EvaluationResult): void {
    if (!this.optionalLayers) {
      for (const layerDefinition of this.layerDefinitions) {
        if (!layerDefinition.isOptional()) {
          result.add(this.evaluateLayersShouldNotBeEmpty(classes, layerDefinition));
        }
      }
    }
  }

  private evaluateLayersShouldNotBeEmpty(typeScriptClasses: TypeScriptClasses, layerDefinition: LayerDefinition): EvaluationResult {
    return classes()
      .thatWithPredicate(this.layerDefinitions.containsPredicateFor(layerDefinition.name))
      .shouldWithConjunction(this.notBeEmptyFor(layerDefinition))
      .evaluate(typeScriptClasses);
  }

  private notBeEmptyFor(layerDefinition: LayerDefinition): ArchCondition<TypeScriptClass> {
    return new LayerShouldNotBeEmptyCondition(layerDefinition);
  }

  private evaluateDependenciesShouldBeSatisfied(
    typeScriptClasses: TypeScriptClasses,
    specification: LayerDependencySpecification
  ): EvaluationResult {
    const satisfyLayerDependenciesCondition: ArchCondition<TypeScriptClass> = ArchConditions.onlyHaveDependentsWhere(
      this.originMatchesIfDependencyIsRelevant(specification.layerName, specification.allowedLayers)
    );
    return classes()
      .thatWithPredicate(this.layerDefinitions.containsPredicateFor(specification.layerName))
      .shouldWithConjunction(satisfyLayerDependenciesCondition)
      .evaluate(typeScriptClasses);
  }

  private originMatchesIfDependencyIsRelevant(ownLayer: string, allowedAccessors: Set<string>): DescribedPredicate<Dependency> {
    const originPackageMatches = Predicates.dependencyOrigin(
      this.layerDefinitions.containsPredicateForLayers(Array.from(allowedAccessors))
    ).or(Predicates.dependencyOrigin(this.layerDefinitions.containsPredicateFor(ownLayer)));
    return this.dependencySettings.ignoreExcludedDependencies.apply(this, [originPackageMatches]);
  }

  getDescription(): string {
    if (this.overriddenDescription.isPresent()) {
      return this.overriddenDescription.orElseThrow();
    }

    const prefix: string = 'Layered architecture ' + this.dependencySettings.getDescription();
    const lines: [string] = [prefix + ', consisting of' + (this.optionalLayers ? ' (optional)' : '')];

    for (const layerDefinition of this.layerDefinitions) {
      lines.push(layerDefinition.toString());
    }

    this.dependencySpecifications.forEach(dependencySpecification => lines.push(dependencySpecification.toString()));

    return lines.join('\n');
  }

  public layer(name: string, ...packageIdentifiers: string[]): LayeredArchitecture {
    this.layerDefinitions.add(new LayerDefinition(name, false, TypeScriptClass.resideInAnyPackage(packageIdentifiers)));
    return this;
  }

  public optionalLayer(name: string, ...packageIdentifiers: string[]): LayeredArchitecture {
    this.layerDefinitions.add(new LayerDefinition(name, true, TypeScriptClass.resideInAnyPackage(packageIdentifiers)));
    return this;
  }

  public whereLayer(name: string): LayerDependencySpecification {
    this.checkLayerNamesExist(name);
    return new LayerDependencySpecification(name, this);
  }

  private checkLayerNamesExist(...layerNames: string[]): void {
    layerNames.forEach(layerName => {
      if (!this.layerDefinitions.containLayer(layerName)) {
        throw new Error(`There is no layer named ${layerName}`);
      }
    });
  }

  public addDependencySpecification(dependencySpecification: LayerDependencySpecification) {
    this.dependencySpecifications.add(dependencySpecification);
    return this;
  }
}

class LayerShouldNotBeEmptyCondition extends ArchCondition<TypeScriptClass> {
  private readonly layerDefinition: LayerDefinition;
  private empty: boolean = true;

  constructor(layerDefinition: LayerDefinition) {
    super('not be empty');
    this.layerDefinition = layerDefinition;
  }

  public check(): void {
    this.empty = false;
  }

  public finish(events: ConditionEvents): void {
    if (this.empty) {
      events.add(SimpleConditionEvent.violated(`Layer '${this.layerDefinition.name}' is empty`));
    }
  }
}

class LayerDefinition {
  readonly name: string;
  private readonly optional: boolean;
  readonly containsPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(name: string, optional: boolean, containsPredicate: DescribedPredicate<TypeScriptClass>) {
    Assert.notNullOrUndefined('name', name);
    Assert.notNullOrUndefined('optional', optional);
    Assert.notNullOrUndefined('containsPredicate', containsPredicate);
    this.name = name;
    this.optional = optional;
    this.containsPredicate = containsPredicate;
  }

  public toString(): string {
    return `${this.optional ? 'optional ' : ''}layer '${this.name}' (${this.containsPredicate.description})`;
  }

  isOptional() {
    return this.optional;
  }
}

class LayerDefinitions implements Iterable<LayerDefinition> {
  private readonly layerDefinitions: Map<string, LayerDefinition> = new Map<string, LayerDefinition>();

  add(definition: LayerDefinition): void {
    this.layerDefinitions.set(definition.name, definition);
  }

  [Symbol.iterator](): Iterator<LayerDefinition> {
    return this.layerDefinitions.values()[Symbol.iterator]();
  }

  containLayer(layerName: string): boolean {
    return this.layerDefinitions.has(layerName);
  }

  containsPredicateFor(layerName: string): DescribedPredicate<TypeScriptClass> {
    return this.containsPredicateForLayers([layerName]);
  }

  containsPredicateForLayers(layerNames: string[]): DescribedPredicate<TypeScriptClass> {
    let result: DescribedPredicate<TypeScriptClass> = DescribedPredicate.alwaysFalse();
    this.get(layerNames).forEach(definition => {
      result = result.or(definition.containsPredicate);
    });

    return result;
  }

  private get(layerNames: string[]): LayerDefinition[] {
    return layerNames.map(layerName => this.layerDefinitions.get(layerName));
  }
}

class LayerDependencySpecification {
  readonly layerName: string;

  readonly allowedLayers: Set<string> = new Set<string>();

  private readonly layeredArchitecture: LayeredArchitecture;

  private descriptionSuffix: string;

  constructor(layerName: string, layeredArchitecture: LayeredArchitecture) {
    this.layerName = layerName;
    this.layeredArchitecture = layeredArchitecture;
  }

  public toString(): string {
    return `where layer '${this.layerName}' ${this.descriptionSuffix}`;
  }

  public mayOnlyBeAccessedByLayers(...layerNames: string[]): LayeredArchitecture {
    return this.restrictLayers(`may only be accessed by layers [${Formatters.joinSingleQuoted(...layerNames)}]`, ...layerNames);
  }

  private restrictLayers(description: string, ...layerNames: string[]): LayeredArchitecture {
    Assert.notNullOrUndefined('layerNames', layerNames);
    Assert.notEmpty('layerNames', layerNames);
    layerNames.forEach(layerName => this.allowedLayers.add(layerName));
    this.descriptionSuffix = description;
    return this.layeredArchitecture.addDependencySpecification(this);
  }

  public mayNotBeAccessedByAnyLayer(): LayeredArchitecture {
    return this.denyLayerAccess('may not be accessed by any layer');
  }

  private denyLayerAccess(description: string): LayeredArchitecture {
    this.allowedLayers.clear();
    this.descriptionSuffix = description;
    return this.layeredArchitecture.addDependencySpecification(this);
  }
}
