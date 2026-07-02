import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../../../../../main/arch-unit/core/domain/TypeScriptMethod';
import { MethodConditions } from '../../../../../../main/arch-unit/lang/conditions/MethodConditions';
import { ViolatedAndSatisfiedConditionEvents } from '../../../../../../main/arch-unit/lang/conditions/ViolatedAndSatisfiedConditionEvents';
import { SimpleConditionEvents } from '../../../../../../main/arch-unit/lang/SimpleConditionEvents';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

describe('MethodConditions', () => {
  const fakeSrc = MorphProjectFixture.fakeSrc();

  const getMethodsFrom = (filename: string): TypeScriptMethod[] => {
    const sourceFile = fakeSrc.getSourceFile(filename)!;
    const declaringClass = TypeScriptClass.of(sourceFile);
    return TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);
  };

  describe('beDecoratedWith', () => {
    it('should have correct description', () => {
      expect(MethodConditions.beDecoratedWith('Transactional').description).toBe('be decorated with @Transactional');
    });

    it('should not add violation when method has the decorator', () => {
      const methods = getMethodsFrom('MethodTransactionalApplicationService.ts');
      const doSomething = methods.find(m => m.methodName === 'doSomething')!;

      const events = new SimpleConditionEvents();
      MethodConditions.beDecoratedWith('Transactional').check(doSomething, events);

      expect(events.getViolating()).toHaveLength(0);
    });

    it('should add violation when method does not have the decorator', () => {
      const methods = getMethodsFrom('NonCompliantApplicationService.ts');
      const method = methods.find(m => m.methodName === 'doSomethingWithoutDecorator')!;

      const events = new SimpleConditionEvents();
      MethodConditions.beDecoratedWith('Transactional').check(method, events);

      expect(events.getViolating()).toHaveLength(1);
      expect(events.getViolating()[0].getDescriptionLines()[0]).toContain('is not decorated with @Transactional');
    });

    it('should include method name and class in violation message', () => {
      const methods = getMethodsFrom('NonCompliantApplicationService.ts');
      const method = methods.find(m => m.methodName === 'doSomethingWithoutDecorator')!;

      const events = new SimpleConditionEvents();
      MethodConditions.beDecoratedWith('Transactional').check(method, events);

      const message = events.getViolating()[0].getDescriptionLines()[0];
      expect(message).toContain('doSomethingWithoutDecorator');
      expect(message).toContain('NonCompliantApplicationService.ts');
    });

    it('should store allowed event when method is decorated', () => {
      const methods = getMethodsFrom('MethodTransactionalApplicationService.ts');
      const doSomething = methods.find(m => m.methodName === 'doSomething')!;

      const events = new ViolatedAndSatisfiedConditionEvents();
      MethodConditions.beDecoratedWith('Transactional').check(doSomething, events);

      expect(events.getAllowed()).toHaveLength(1);
      expect(events.getAllowed()[0].getDescriptionLines()[0]).toContain('is decorated with @Transactional');
    });
  });

  describe('beDeclaredInClassThat', () => {
    it('should have correct description', () => {
      const classPredicate = TypeScriptClass.simpleNameEndingWith('ApplicationService.ts');
      expect(MethodConditions.beDeclaredInClassThat(classPredicate).description).toBe(
        'be declared in classes that simple name ending with ApplicationService.ts'
      );
    });

    it('should not add violation when declaring class matches', () => {
      const methods = getMethodsFrom('MethodTransactionalApplicationService.ts');
      const method = methods.find(m => m.methodName === 'doSomething')!;

      const events = new SimpleConditionEvents();
      MethodConditions.beDeclaredInClassThat(TypeScriptClass.simpleNameEndingWith('ApplicationService.ts')).check(method, events);

      expect(events.getViolating()).toHaveLength(0);
    });

    it('should add violation when declaring class does not match', () => {
      const methods = getMethodsFrom('MethodTransactionalApplicationService.ts');
      const method = methods.find(m => m.methodName === 'doSomething')!;

      const events = new SimpleConditionEvents();
      MethodConditions.beDeclaredInClassThat(TypeScriptClass.simpleNameEndingWith('Repository.ts')).check(method, events);

      expect(events.getViolating()).toHaveLength(1);
      expect(events.getViolating()[0].getDescriptionLines()[0]).toContain('is not declared in class that');
    });

    it('should store allowed event when declaring class matches', () => {
      const methods = getMethodsFrom('MethodTransactionalApplicationService.ts');
      const method = methods.find(m => m.methodName === 'doSomething')!;

      const events = new ViolatedAndSatisfiedConditionEvents();
      MethodConditions.beDeclaredInClassThat(TypeScriptClass.simpleNameEndingWith('ApplicationService.ts')).check(method, events);

      expect(events.getAllowed()).toHaveLength(1);
      expect(events.getAllowed()[0].getDescriptionLines()[0]).toContain('is declared in class that');
    });
  });
});
