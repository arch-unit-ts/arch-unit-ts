import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../../../../../main/arch-unit/core/domain/TypeScriptMethod';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

describe('TypeScriptMethod', () => {
  const fakeSrc = MorphProjectFixture.fakeSrc();
  const otherSrc = MorphProjectFixture.otherSrc();

  describe('fromSourceFile', () => {
    describe('class declarations', () => {
      it('should extract all methods including private ones', () => {
        const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
        const declaringClass = TypeScriptClass.of(sourceFile);
        const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

        expect(methods.map(m => m.methodName)).toEqual(expect.arrayContaining(['doSomething', 'getResult', 'privateMethod']));
      });

      it('should set declaringClass reference', () => {
        const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
        const declaringClass = TypeScriptClass.of(sourceFile);
        const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

        methods.forEach(method => expect(method.declaringClass).toBe(declaringClass));
      });
    });

    describe('interface declarations', () => {
      it('should extract methods from interfaces as public and non-abstract with no decorators', () => {
        const sourceFile = otherSrc.getSourceFile('InterfaceWithMethods.ts')!;
        const declaringClass = TypeScriptClass.of(sourceFile);
        const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

        expect(methods).toHaveLength(2);
        expect(methods.map(m => m.methodName)).toEqual(expect.arrayContaining(['compute', 'describe']));
        methods.forEach(method => {
          expect(method.isPublic()).toBe(true);
          expect(method.isAbstract()).toBe(false);
          expect(method.decorators).toEqual([]);
        });
      });
    });

    it('should return empty array for file with no classes or interfaces', () => {
      const sourceFile = otherSrc.getSourceFile('FileWithUnknownImport.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      expect(methods).toHaveLength(0);
    });
  });

  describe('isPublic', () => {
    it('should return true for method with no access modifier (implicitly public)', () => {
      const sourceFile = fakeSrc.getSourceFile('NonCompliantApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const method = methods.find(m => m.methodName === 'doSomethingWithoutDecorator')!;
      expect(method.isPublic()).toBe(true);
    });

    it('should return false for private method', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const privateMethod = methods.find(m => m.methodName === 'privateMethod')!;
      expect(privateMethod.isPublic()).toBe(false);
    });
  });

  describe('isAbstract', () => {
    it('should return false for concrete method', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      methods.forEach(method => expect(method.isAbstract()).toBe(false));
    });
  });

  describe('isDecoratedWith', () => {
    it('should return true when method has the decorator', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const doSomething = methods.find(m => m.methodName === 'doSomething')!;
      expect(doSomething.isDecoratedWith('Transactional')).toBe(true);
    });

    it('should return false when method does not have the decorator', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const privateMethod = methods.find(m => m.methodName === 'privateMethod')!;
      expect(privateMethod.isDecoratedWith('Transactional')).toBe(false);
    });
  });

  describe('arePublic static predicate', () => {
    it('should have correct description', () => {
      expect(TypeScriptMethod.arePublic().description).toBe('are public');
    });

    it('should match public methods', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const predicate = TypeScriptMethod.arePublic();
      const doSomething = methods.find(m => m.methodName === 'doSomething')!;
      const privateMethod = methods.find(m => m.methodName === 'privateMethod')!;

      expect(predicate.test(doSomething)).toBe(true);
      expect(predicate.test(privateMethod)).toBe(false);
    });
  });

  describe('areNotAbstract static predicate', () => {
    it('should have correct description', () => {
      expect(TypeScriptMethod.areNotAbstract().description).toBe('are not abstract');
    });

    it('should match non-abstract methods', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const predicate = TypeScriptMethod.areNotAbstract();
      methods.forEach(method => expect(predicate.test(method)).toBe(true));
    });
  });

  describe('areDecoratedWith static predicate', () => {
    it('should have correct description', () => {
      expect(TypeScriptMethod.areDecoratedWith('Transactional').description).toBe('are decorated with @Transactional');
    });

    it('should return true for decorated method', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const predicate = TypeScriptMethod.areDecoratedWith('Transactional');
      const doSomething = methods.find(m => m.methodName === 'doSomething')!;
      expect(predicate.test(doSomething)).toBe(true);
    });

    it('should return false for undecorated method', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const predicate = TypeScriptMethod.areDecoratedWith('Transactional');
      const privateMethod = methods.find(m => m.methodName === 'privateMethod')!;
      expect(predicate.test(privateMethod)).toBe(false);
    });
  });

  describe('areDeclaredInClassThat static predicate', () => {
    it('should have correct description', () => {
      const classPredicate = TypeScriptClass.simpleNameEndingWith('ApplicationService.ts');
      expect(TypeScriptMethod.areDeclaredInClassThat(classPredicate).description).toBe(
        'are declared in classes that simple name ending with ApplicationService.ts'
      );
    });

    it('should return true when declaring class matches', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const predicate = TypeScriptMethod.areDeclaredInClassThat(TypeScriptClass.simpleNameEndingWith('ApplicationService.ts'));
      methods.forEach(method => expect(predicate.test(method)).toBe(true));
    });

    it('should return false when declaring class does not match', () => {
      const sourceFile = fakeSrc.getSourceFile('MethodTransactionalApplicationService.ts')!;
      const declaringClass = TypeScriptClass.of(sourceFile);
      const methods = TypeScriptMethod.fromSourceFile(sourceFile, declaringClass);

      const predicate = TypeScriptMethod.areDeclaredInClassThat(TypeScriptClass.simpleNameEndingWith('Repository.ts'));
      methods.forEach(method => expect(predicate.test(method)).toBe(false));
    });
  });
});
