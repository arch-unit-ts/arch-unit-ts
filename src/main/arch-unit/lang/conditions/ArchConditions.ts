import { ArchFunction } from '../../base/ArchFunction';
import { DescribedPredicate } from '../../base/DescribedPredicate';
import { Dependency, Functions, TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { ArchCondition, ConditionByPredicate } from '../ArchCondition';
import { ConditionEvent } from '../ConditionEvent';
import { ConditionEvents } from '../ConditionEvents';
import { SimpleConditionEvent } from '../SimpleConditionEvent';

import { ArchPredicates } from './ArchPredicates';
import { InvertingConditionEvents } from './InvertingConditionEvents';
import { ViolatedAndSatisfiedConditionEvents } from './ViolatedAndSatisfiedConditionEvents';

export abstract class ArchConditions {
  static onlyDependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AllDependenciesCondition(
      'only depend on classes that ' + predicate.description,
      Functions.GET_TARGET_CLASS.is(predicate),
      TypeScriptClass.GET_DIRECT_DEPENDENCIES_FROM_SELF
    );
  };

  static dependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AnyDependencyCondition(
      'depend on classes that ' + predicate.description,
      Functions.GET_TARGET_CLASS.is(predicate),
      TypeScriptClass.GET_DIRECT_DEPENDENCIES_FROM_SELF
    );
  };

  static onlyHaveDependentClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return this.onlyHaveDependentsWhere(Functions.GET_ORIGIN_CLASS.is(predicate)).as(
      'only have dependent classes that ' + predicate.description
    );
  };

  public static onlyHaveDependentsWhere(predicate: DescribedPredicate<Dependency>): ArchCondition<TypeScriptClass> {
    const description: string = 'only have dependents where ' + predicate.description;
    return new AllDependenciesCondition(description, predicate, TypeScriptClass.GET_DIRECT_DEPENDENCIES_TO_SELF);
  }

  static negate<T>(condition: ArchCondition<T>): ArchCondition<T> {
    return new NeverCondition(condition);
  }

  public static haveSimpleNameStartingWith(prefix: string): ArchCondition<TypeScriptClass> {
    return this.have(TypeScriptClass.simpleNameStartingWith(prefix));
  }

  public static have(predicate: DescribedPredicate<TypeScriptClass>): ConditionByPredicate {
    return ArchCondition.from(predicate).as(ArchPredicates.have(predicate).description);
  }
}

class ContainAnyCondition<T> extends ArchCondition<T[]> {
  private readonly condition: ArchCondition<T>;

  constructor(condition: ArchCondition<T>) {
    super('contain any element that ' + condition.description);
    this.condition = condition;
  }

  public check(collection: T[], events: ConditionEvents): void {
    const subEvents: ViolatedAndSatisfiedConditionEvents = new ViolatedAndSatisfiedConditionEvents();
    collection.forEach(item => this.condition.check(item, subEvents));

    if (subEvents.getAllowed().length > 0 || subEvents.getViolating().length > 0) {
      events.add(AnyConditionEvent.default(collection, subEvents));
    }
  }
}

class AnyConditionEvent implements ConditionEvent {
  private readonly correspondingObjects: unknown[];
  private readonly allowed: ConditionEvent[];
  private readonly violating: ConditionEvent[];

  static default(correspondingObjects: unknown[], events: ViolatedAndSatisfiedConditionEvents): AnyConditionEvent {
    return new AnyConditionEvent(correspondingObjects, events.getAllowed(), events.getViolating());
  }

  constructor(correspondingObjects: unknown[], allowed: ConditionEvent[], violating: ConditionEvent[]) {
    this.correspondingObjects = correspondingObjects;
    this.allowed = allowed;
    this.violating = violating;
  }

  public isViolation(): boolean {
    return this.allowed.length === 0;
  }

  public invert(): ConditionEvent {
    return new OnlyConditionEvent(this.correspondingObjects, this.violating, this.allowed);
  }

  public getDescriptionLines(): string[] {
    return [this.violating.flatMap(input => input.getDescriptionLines()).join('\n')];
  }
}

class ContainsOnlyCondition<T> extends ArchCondition<T[]> {
  private readonly condition: ArchCondition<T>;

  constructor(condition: ArchCondition<T>) {
    super('contain only elements that ' + condition.description);
    this.condition = condition;
  }

  check(collection: T[], events: ConditionEvents): void {
    const subEvents: ViolatedAndSatisfiedConditionEvents = new ViolatedAndSatisfiedConditionEvents();
    collection.forEach(item => this.condition.check(item, subEvents));

    if (subEvents.getAllowed().length > 0 || subEvents.getViolating().length > 0) {
      events.add(OnlyConditionEvent.default(collection, subEvents));
    }
  }
}

class OnlyConditionEvent implements ConditionEvent {
  private readonly correspondingObjects: unknown[];
  private readonly allowed: ConditionEvent[];
  private readonly violating: ConditionEvent[];

  constructor(correspondingObjects: unknown[], allowed: ConditionEvent[], violating: ConditionEvent[]) {
    this.correspondingObjects = correspondingObjects;
    this.allowed = allowed;
    this.violating = violating;
  }

  static default(correspondingObjects: unknown[], events: ViolatedAndSatisfiedConditionEvents): OnlyConditionEvent {
    return new OnlyConditionEvent(correspondingObjects, events.getAllowed(), events.getViolating());
  }

  public isViolation(): boolean {
    return this.violating.length > 0;
  }

  public invert(): ConditionEvent {
    return new AnyConditionEvent(this.correspondingObjects, this.violating, this.allowed);
  }

  public getDescriptionLines(): string[] {
    return this.violating.flatMap(conditionEvent => conditionEvent.getDescriptionLines());
  }
}

class DependencyCondition extends ArchCondition<Dependency> {
  private readonly conditionPredicate: DescribedPredicate<Dependency>;

  constructor(conditionPredicate: DescribedPredicate<Dependency>) {
    super(conditionPredicate.description);
    this.conditionPredicate = conditionPredicate;
  }

  check(item: Dependency, events: ConditionEvents): void {
    events.add(new SimpleConditionEvent(`Dependency ${item.getDescription()}`, !this.conditionPredicate.test(item)));
  }
}

class AllDependenciesCondition extends ArchCondition<TypeScriptClass> {
  private readonly condition: ArchCondition<Dependency>;
  private readonly conditionPredicate: DescribedPredicate<Dependency>;
  private readonly typeScriptClassToRelevantDependencies: ArchFunction<TypeScriptClass, Dependency[]>;

  constructor(
    description: string,
    conditionPredicate: DescribedPredicate<Dependency>,
    typeScriptClassToRelevantDependencies: ArchFunction<TypeScriptClass, Dependency[]>
  ) {
    super(description);
    this.condition = new DependencyCondition(conditionPredicate);
    this.conditionPredicate = conditionPredicate;
    this.typeScriptClassToRelevantDependencies = typeScriptClassToRelevantDependencies;
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    new ContainsOnlyCondition(this.condition).check(this.typeScriptClassToRelevantDependencies.apply(typeScriptClass), events);
  }
}

class AnyDependencyCondition extends ArchCondition<TypeScriptClass> {
  private readonly condition: ArchCondition<Dependency>;
  private readonly conditionPredicate: DescribedPredicate<Dependency>;
  private readonly typeScriptClassToRelevantDependencies: ArchFunction<TypeScriptClass, Dependency[]>;

  constructor(
    description: string,
    conditionPredicate: DescribedPredicate<Dependency>,
    typeScriptClassToRelevantDependencies: ArchFunction<TypeScriptClass, Dependency[]>
  ) {
    super(description);
    this.condition = new DependencyCondition(conditionPredicate);
    this.conditionPredicate = conditionPredicate;
    this.typeScriptClassToRelevantDependencies = typeScriptClassToRelevantDependencies;
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    new ContainAnyCondition(this.condition).check(this.typeScriptClassToRelevantDependencies.apply(typeScriptClass), events);
  }
}

class NeverCondition<T> extends ArchCondition<T> {
  private readonly condition: ArchCondition<T>;

  constructor(condition: ArchCondition<T>) {
    super('never ' + condition.description);
    this.condition = condition;
  }

  check(item: T, events: ConditionEvents): void {
    this.condition.check(item, new InvertingConditionEvents(events));
  }
}
