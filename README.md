# Arch-Unit-TS

Arch-unit-ts is a free library for checking your typescript architecture. Inspired by [ArchUnit](https://github.com/TNG/ArchUnit) .

This library can check dependencies between packages and classes. The main goal of Arch-Unit-ts is to automatically test architecture and coding rules of your project.

We began to implement functionalities in order to be able to test a hexagonal architecture the same way it is done in [JhipsterLite](https://github.com/jhipster/jhipster-lite/blob/main/src/test/java/tech/jhipster/lite/HexagonalArchTest.java)

<!-- TOC -->

- [How to use](#how-to-use)
  - [Installation](#installation)
    - [Hexagonal Arch Test example](#hexagonal-arch-test-example)
- [How to contribute](#how-to-contribute) \* [Get project](#get-project)
<!-- TOC -->

## How to use

### Installation

`npm install arch-unit-ts`

#### Hexagonal Arch Test example

```
const srcProject = new TypeScriptProject(RelativePath.of('src/main'));

describe('HexagonalArchTest', () => {
  const sharedKernels = packagesWithContext(SharedKernel.name);
  const businessContexts = packagesWithContext(BusinessContext.name);

  function otherBusinessContextsDomains(context: string): string[] {
    return businessContexts.filter((other) => context !== other).map((name) => name + '/domain');
  }

  function packagesWithContext(contextName: string): string[] {
    return srcProject
      .filterClassesByClassName('package-info')
      .filter((typeScriptClass) => typeScriptClass.hasImport(contextName))
      .map((typeScriptClass) => typeScriptClass.packagePath.get());
  }

  describe('BoundedContexts', () => {
    it('Should not depend on other bounded context domains', () => {
      [...sharedKernels, ...businessContexts].forEach((context) =>
        noClasses()
          .that()
          .resideInAnyPackage(context)
          .should()
          .onlyDependOnClassesThat()
          .resideInAnyPackage(...otherBusinessContextsDomains(context))
          .because('Contexts can only depend on classes in the same context or shared kernels')
          .check(srcProject.allClasses())
      );
    });
  });

  describe('Domain', () => {
    it('Should not depend on outside', () => {
      classes()
        .that()
        .resideInAPackage('/domain')
        .should()
        .onlyDependOnClassesThat()
        .resideInAnyPackage('/domain', ...sharedKernels)
        .because('Domain model should only depend on domains and a very limited set of external dependencies')
        .check(srcProject.allClasses());
    });
  });

  describe('Application', () => {
    it('Should not depend on infrastructure', () => {
      noClasses()
        .that()
        .resideInAPackage('/application')
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage('/infrastructure')
        .because('Application should only depend on domain, not on infrastructure')
        .check(srcProject.allClasses());
    });
  });

  describe('Primary', () => {
    it('Should not depend on secondary', () => {
      noClasses()
        .that()
        .resideInAPackage('/primary')
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage('/secondary')
        .because('Primary should not interact with secondary')
        .check(srcProject.allClasses());
    });
  });

  describe('Secondary', () => {
    it('should not depend on application', () => {
      noClasses()
        .that()
        .resideInAPackage('infrastructure/secondary')
        .should()
        .dependOnClassesThat()
        .resideInAPackage('application')
        .because('Secondary should not depend on application')
        .check(srcProject.allClasses());
    });

    it('should not depend on same context primary', () => {
      [...sharedKernels, ...businessContexts].forEach((context) =>
        noClasses()
          .that()
          .resideInAPackage(context + '/infrastructure/secondary')
          .should()
          .onlyDependOnClassesThat()
          .resideInAPackage(context + '/infrastructure/primary')
          .because("Secondary should not loop to its own context's primary")
          .check(srcProject.allClasses())
      );
    });
  });
});
```

## How to contribute

### Get project

... Coming soon ...
