import { TypeScriptClass } from '../TypeScriptClass';

import { PredicateAggregator } from './PredicateAggregator';

export class ClassesTransformer {
  private readonly predicateAggregator: PredicateAggregator<TypeScriptClass>;

  constructor(predicateAggregator: PredicateAggregator<TypeScriptClass>) {
    this.predicateAggregator = predicateAggregator;
  }

  transform(classes: TypeScriptClass[]): TypeScriptClass[] {
    if (this.predicateAggregator.getPredicate().isEmpty()) {
      return classes;
    }

    return classes.filter(aClass =>
      this.predicateAggregator
        .getPredicate()
        .map(predicate => predicate.test(aClass))
        .orElseThrow()
    );
  }
}
