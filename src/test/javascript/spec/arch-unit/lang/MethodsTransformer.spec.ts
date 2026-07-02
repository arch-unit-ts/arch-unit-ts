import { TypeScriptClass } from '../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../../../../main/arch-unit/core/domain/TypeScriptMethod';
import { MethodsTransformer } from '../../../../../main/arch-unit/lang/MethodsTransformer';
import { PredicateAggregator } from '../../../../../main/arch-unit/lang/synthax/PredicateAggregator';
import { MorphProjectFixture } from '../morph/MorphProjectFixture';

describe('MethodsTransformer', () => {
  const fakeSrc = MorphProjectFixture.fakeSrc();
  const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
  const tsClass = TypeScriptClass.of(sourceFile);
  const classes = [tsClass];

  describe('transform', () => {
    it('should return all methods when no predicate is set', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default());
      const methods = transformer.transform(classes);

      expect(methods.length).toBeGreaterThan(0);
      expect(methods.every(m => m.declaringClass === tsClass)).toBe(true);
    });

    it('should filter methods using the predicate', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default()).addPredicate(TypeScriptMethod.arePublic());
      const methods = transformer.transform(classes);

      expect(methods.every(m => m.isPublic())).toBe(true);
      expect(methods.some(m => m.methodName === 'doSomething')).toBe(true);
      expect(methods.some(m => m.methodName === 'privateMethod')).toBe(false);
    });

    it('should return empty array for class without source file', () => {
      const classWithoutSourceFile = TypeScriptClass.withoutDependencies(tsClass.name, tsClass.packagePath);
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default());
      expect(transformer.transform([classWithoutSourceFile])).toHaveLength(0);
    });
  });

  describe('getDescription', () => {
    it('should return the transformer description', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default());
      expect(transformer.getDescription()).toBe('methods');
    });
  });

  describe('getFullDescription', () => {
    it('should return description only when no predicate', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default());
      expect(transformer.getFullDescription()).toBe('methods');
    });

    it('should include predicate description when predicate is set', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default()).addPredicate(TypeScriptMethod.arePublic());
      expect(transformer.getFullDescription()).toBe('methods are public');
    });
  });

  describe('switchModeAnd', () => {
    it('should combine predicates with AND', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default())
        .addPredicate(TypeScriptMethod.arePublic())
        .switchModeAnd()
        .addPredicate(TypeScriptMethod.areDecoratedWith('Transactional'));

      const methods = transformer.transform(classes);
      expect(methods.every(m => m.isPublic() && m.isDecoratedWith('Transactional'))).toBe(true);
    });
  });

  describe('switchModeOr', () => {
    it('should combine predicates with OR', () => {
      const transformer = new MethodsTransformer('methods', PredicateAggregator.default())
        .addPredicate(TypeScriptMethod.arePublic())
        .switchModeOr()
        .addPredicate(TypeScriptMethod.areDecoratedWith('Transactional'));

      const methods = transformer.transform(classes);
      expect(methods.length).toBeGreaterThan(0);
    });
  });

  describe('constructor validation', () => {
    it.each([null, undefined])('should throw when description is %s', nullOrUndefined => {
      expect(() => new MethodsTransformer(nullOrUndefined as unknown as string, PredicateAggregator.default())).toThrow(
        'description should not be null or undefined'
      );
    });

    it.each([null, undefined])('should throw when predicateAggregator is %s', nullOrUndefined => {
      expect(() => new MethodsTransformer('methods', nullOrUndefined as unknown as PredicateAggregator<TypeScriptMethod>)).toThrow(
        'predicateAggregator should not be null or undefined'
      );
    });
  });
});
