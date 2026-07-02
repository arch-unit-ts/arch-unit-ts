import { Assert } from '../../error/domain/Assert';
import { DescribedPredicate } from '../base/DescribedPredicate';
import { HasDescription } from '../base/HasDescription';
import { TypeScriptClass } from '../core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../core/domain/TypeScriptMethod';

import { PredicateAggregator } from './synthax/PredicateAggregator';

export class MethodsTransformer implements HasDescription {
  private readonly description: string;
  private readonly predicateAggregator: PredicateAggregator<TypeScriptMethod>;

  constructor(description: string, predicateAggregator: PredicateAggregator<TypeScriptMethod>) {
    Assert.notNullOrUndefined('description', description);
    Assert.notNullOrUndefined('predicateAggregator', predicateAggregator);
    this.description = description;
    this.predicateAggregator = predicateAggregator;
  }

  addPredicate(predicate: DescribedPredicate<TypeScriptMethod>): MethodsTransformer {
    return new MethodsTransformer(this.description, this.predicateAggregator.add(predicate));
  }

  switchModeAnd(): MethodsTransformer {
    return new MethodsTransformer(this.description, this.predicateAggregator.thatANDs());
  }

  switchModeOr(): MethodsTransformer {
    return new MethodsTransformer(this.description, this.predicateAggregator.thatORs());
  }

  transform(classes: TypeScriptClass[]): TypeScriptMethod[] {
    const allMethods = classes.flatMap(tsClass => {
      const sourceFile = tsClass.getSourceFile();
      return sourceFile ? TypeScriptMethod.fromSourceFile(sourceFile, tsClass) : [];
    });

    if (this.predicateAggregator.getPredicate().isEmpty()) {
      return allMethods;
    }

    return allMethods.filter(method =>
      this.predicateAggregator
        .getPredicate()
        .map(predicate => predicate.test(method))
        .orElseThrow()
    );
  }

  getDescription(): string {
    return this.description;
  }

  getFullDescription(): string {
    return (
      this.description +
      this.predicateAggregator
        .getPredicate()
        .map(predicate => ' ' + predicate.description)
        .orElse('')
    );
  }
}
