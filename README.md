# arch-unit-ts

arch-unit-ts is a free library for checking your typescript architecture. Inspired by [ArchUnit](https://github.com/TNG/ArchUnit) .

This library can check dependencies between packages and classes, and enforce method-level conventions (decorators, async). The main goal of Arch-Unit-ts is to automatically test architecture and coding rules of your project.

We began to implement functionalities in order to be able to test a hexagonal architecture the same way it is done in [JhipsterLite](https://github.com/jhipster/jhipster-lite/blob/main/src/test/java/tech/jhipster/lite/HexagonalArchTest.java)

<!-- TOC -->

- [How to use](#how-to-use)
  - [Installation](#installation)
  - [Hexago/compactnal Arch Test example](#hexagonal-arch-test-example)
  - [Method-level rules](#method-level-rules)
  - [Configuration](#configuration)
  - [Troubleshooting](#troubleshooting)
  <!-- TOC -->

## How to use

I tried to stay as close as I could to ArchUnit. If something is implemented, it should work the same way as the original one.

### Installation

`npm install arch-unit-ts`

### Hexagonal Arch Test example

First, you will need to create two files SharedKernel.ts and BusinessContext.ts.
You can place them at the root of you webapp project.

```
export abstract class SharedKernel {}
```

```
export abstract class BusinessContext {}
```

Then, in each context you have, you will need to add a package-info.ts in the context root folder.
If it's a business context, make it extends BusinessContext.
If it's a shared kernel, make it extends SharedKernel.
The important part is the imports, make sure you import only one of them.

```
import { SharedKernel } from "@/SharedKernel";

class PackageInfo extends SharedKernel {}

/// OR

import {BusinessContext} from "@/BusinessContext";

class PackageInfo extends BusinessContext {}
```

Example of packages:

![folder_example.png](https://github.com/arch-unit-ts/arch-unit-ts/blob/main/src/main/resouces/folder_example.png?raw=true)

Then, you can create an HexagonalArchTest.spec.ts.
The path of your source project (folder from which you want to test your architecture) is a relative path starting from your tsconfig.json file.

```
import { TypeScriptProject } from 'arch-unit-ts/dist/arch-unit/core/domain/TypeScriptProject';
import { RelativePath } from 'arch-unit-ts/dist/arch-unit/core/domain/RelativePath';
import { classes, noClasses } from 'arch-unit-ts/dist/main';
import { SharedKernel } from '@/app/SharedKernel';
import { BusinessContext } from '@/app/BusinessContext';
import { Architectures } from 'arch-unit-ts/dist/arch-unit/library/Architectures';

describe('HexagonalArchTest', () => {
  const srcProject = new TypeScriptProject(RelativePath.of('src/main/app'), '**/*FilesToExclude*', '**/*OtherFilesToExclude*');

  const sharedKernels = packagesWithContext(SharedKernel.name);
  const businessContexts = packagesWithContext(BusinessContext.name);

  function otherBusinessContextsDomains(context: string): string[] {
      return businessContexts.filter(other => context !== other).map(name => name + '.domain..');
  }

  function packagesWithContext(contextName: string): string[] {
    return srcProject
      .filterClasses('**/package-info.ts')
      .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
      .map(typeScriptClass => typeScriptClass.packagePath.getDotsPath());
  }

  describe('BoundedContexts', () => {
    it.each([...sharedKernels, ...businessContexts])('Should %s not depend on other bounded context domains', (context) => {
      noClasses()
        .that()
        .resideInAnyPackage(context + '..')
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage(...otherBusinessContextsDomains(context))
        .because('Contexts can only depend on classes in the same context or shared kernels')
        .check(srcProject.allClasses());
    });

    it('primary TypeScript Adapters should only be called from secondaries', () => {
      classes()
        .that()
        .resideInAPackage('..primary..')
        .and()
        .haveSimpleNameStartingWith('TypeScript')
        .should()
        .onlyHaveDependentClassesThat()
        .resideInAPackage('..secondary..')
        .because(
          "To interact between two contexts, secondary from context 'A' should call a primary TypeScript adapter (naming convention starting with 'TypeScript') from context 'B'"
        )
        .check(srcProject.allClasses());
    });
  });

  describe('Domain', () => {
    it('Should not depend on outside', () => {
      classes()
        .that()
        .resideInAPackage('..domain..')
        .should()
        .onlyDependOnClassesThat()
        .resideInAnyPackage('..domain..', ...sharedKernels)
        .because('Domain model should only depend on domains and a very limited set of external dependencies')
        .check(srcProject.allClasses());
    });

    it.each([...sharedKernels, ...businessContexts])('should be an hexagonal architecture in context %s', context => {
      Architectures.layeredArchitecture()
        .consideringOnlyDependenciesInAnyPackage(context + '..')
        .withOptionalLayers(true)
        .layer('domain models', context + '.domain..')
        .layer('domain services', context + '.domain..')
        .layer('application services', context + '.application..')
        .layer('primary adapters', context + '.infrastructure.primary..')
        .layer('secondary adapters', context + '.infrastructure.secondary..')
        .whereLayer('application services')
        .mayOnlyBeAccessedByLayers('primary adapters')
        .whereLayer('primary adapters')
        .mayNotBeAccessedByAnyLayer()
        .whereLayer('secondary adapters')
        .mayNotBeAccessedByAnyLayer()
        .because('Each bounded context should implement an hexagonal architecture')
        .check(srcProject.allClasses());
    });
  });

  describe('Application', () => {
    it('Should not depend on infrastructure', () => {
      noClasses()
        .that()
        .resideInAPackage('..application..')
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage('..infrastructure..')
        .because('Application should only depend on domain, not on infrastructure')
        .check(srcProject.allClasses());
    });
  });

  describe('Primary', () => {
    it('Should not depend on secondary', () => {
      noClasses()
        .that()
        .resideInAPackage('..primary..')
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage('..secondary..')
        .because('Primary should not interact with secondary')
        .check(srcProject.allClasses());
    });
  });

  describe('Secondary', () => {
    it('should not depend on application', () => {
      noClasses()
        .that()
        .resideInAPackage('..infrastructure.secondary..')
        .should()
        .dependOnClassesThat()
        .resideInAPackage('..application..')
        .because('Secondary should not depend on application')
        .check(srcProject.allClasses());
    });

    it.each([...sharedKernels, ...businessContexts])('should %s not depend on same context primary', (context) => {
      noClasses()
        .that()
        .resideInAPackage(context + '.infrastructure.secondary..')
        .should()
        .onlyDependOnClassesThat()
        .resideInAPackage(context + '.infrastructure.primary..')
        .because("Secondary should not loop to its own context's primary")
        .check(srcProject.allClasses());
    });
  });
});
```

### Method-level rules

In addition to class-level rules, arch-unit-ts supports architecture rules at the **method level** using `methods()` and `noMethods()`. This is useful for enforcing decorator and async conventions on service methods.

#### Import

```ts
import { ArchRuleDefinition } from 'arch-unit-ts/dist/arch-unit/lang/synthax/ArchRuleDefinition';
```

#### Available predicates in `.that()`

| Predicate                     | Description                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `.arePublic()`                | Matches methods without a private/protected modifier                                               |
| `.areNotAbstract()`           | Matches concrete (non-abstract) methods                                                            |
| `.areAsync()`                 | Matches methods declared with the `async` keyword                                                  |
| `.areDecoratedWith('Name')`   | Matches methods annotated with `@Name(...)`                                                        |
| `.areDeclaredInClassesThat()` | Delegates to a class predicate (e.g. `.resideInAnyPackage(...)`, `.haveSimpleNameEndingWith(...)`) |

Predicates can be chained with `.and()` and `.or()`.

#### Available conditions in `.should()`

| Condition                    | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `.beDecoratedWith('Name')`   | The method must carry the decorator `@Name`      |
| `.beAsync()`                 | The method must be declared `async`              |
| `.beDeclaredInClassesThat()` | The declaring class must match a class predicate |

Conditions can be chained with `.andShould()` and `.orShould()`.

#### Example: all public application-service methods must be `@Transactional` or `@NotTransactional`

```ts
import { TypeScriptProject } from 'arch-unit-ts/dist/arch-unit/core/domain/TypeScriptProject';
import { RelativePath } from 'arch-unit-ts/dist/arch-unit/core/domain/RelativePath';
import { ArchRuleDefinition } from 'arch-unit-ts/dist/arch-unit/lang/synthax/ArchRuleDefinition';

describe('TransactionalArchTest', () => {
  const project = new TypeScriptProject(RelativePath.of('src/main/app'));
  const allClasses = project.allClasses();

  it('public methods of application services must be @Transactional or @NotTransactional', () => {
    ArchRuleDefinition.methods()
      .that()
      .arePublic()
      .and()
      .areNotAbstract()
      .and()
      .areDeclaredInClassesThat()
      .resideInAnyPackage('..application..')
      .and()
      .areDeclaredInClassesThat()
      .haveSimpleNameEndingWith('ApplicationService.ts')
      .should()
      .beDecoratedWith('Transactional')
      .orShould()
      .beDecoratedWith('NotTransactional')
      .orShould()
      .beDeclaredInClassesThat()
      .areDecoratedWith('Transactional')
      .orShould()
      .beDeclaredInClassesThat()
      .areDecoratedWith('NotTransactional')
      .because('All application service methods must declare their transactional intent')
      .allowEmptyShould(true)
      .check(allClasses);
  });
});
```

#### Example: methods decorated with `@Transactional` must be `async`

```ts
it('methods decorated with @Transactional must be async', () => {
  ArchRuleDefinition.methods().that().areDecoratedWith('Transactional').should().beAsync().allowEmptyShould(true).check(allClasses);
});
```

#### Example: async methods in application services must carry `@Transactional`

```ts
it('async application service methods must be @Transactional', () => {
  ArchRuleDefinition.methods()
    .that()
    .areAsync()
    .and()
    .areDeclaredInClassesThat()
    .resideInAnyPackage('..application..')
    .should()
    .beDecoratedWith('Transactional')
    .allowEmptyShould(true)
    .check(allClasses);
});
```

#### Using `noMethods()` (inverted rule)

`noMethods()` fails if **any** method matches the condition, instead of failing when one does not:

```ts
it('no application service method should be decorated with @Deprecated', () => {
  ArchRuleDefinition.noMethods()
    .that()
    .areDeclaredInClassesThat()
    .haveSimpleNameEndingWith('ApplicationService.ts')
    .should()
    .beDecoratedWith('Deprecated')
    .allowEmptyShould(true)
    .check(allClasses);
});
```

#### `allowEmptyShould` and `because`

- `.allowEmptyShould(true)` — silently passes when no method matches the `.that()` clause (useful when a feature is not yet present in all projects).
- `.allowEmptyShould(false)` — throws if no method is checked (default: driven by `arch-unit-ts.json`).
- `.because('reason')` — appends a human-readable explanation to the violation message.

### Configuration

You can add a configuration file at your project root called arch-unit-ts.json with the following properties (default values bellow).

```
{
  "showImportsWarning": true,
  "failOnEmptyShould": false
}
```

### Troubleshooting

TsMorph might have difficulties to read some dependencies.
When it happens, a warn will be printed in the console.
With jest, this warn might be quite big because its console also print the place where the warn has happened. (Switch to vitest ? :p)
