# arch-unit-ts

arch-unit-ts is a free library for checking your typescript architecture. Inspired by [ArchUnit](https://github.com/TNG/ArchUnit) .

This library can check dependencies between packages and classes. The main goal of Arch-Unit-ts is to automatically test architecture and coding rules of your project.

We began to implement functionalities in order to be able to test a hexagonal architecture the same way it is done in [JhipsterLite](https://github.com/jhipster/jhipster-lite/blob/main/src/test/java/tech/jhipster/lite/HexagonalArchTest.java)

<!-- TOC -->

- [How to use](#how-to-use)
  - [Installation](#installation)
  - [Hexagonal Arch Test example](#hexagonal-arch-test-example)
  - [Troubleshooting](#troubleshooting)
- [How to contribute](#how-to-contribute)
  - [Get project](#get-project)
  - [Run ut](#run-it)
  - [Submitting a pull request](#submitting-a-pull-request)
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

![folder_example.png](src/main/resouces/folder_example.png)

Then, you can create an HexagonalArchTest.spec.ts.
The path of your source project (folder from which you want to test your architecture) is a relative path starting from your tsconfig.json file.

```
import { TypeScriptProject } from "arch-unit-ts/dist/arch-unit/core/domain/TypeScriptProject";
import { RelativePath } from "arch-unit-ts/dist/arch-unit/core/domain/RelativePath";
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
          "To interact between two contexts, secondary from context 'A' should call a primary Java adapter (naming convention starting with 'Java') from context 'B'"
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

### Troubleshooting

TsMorph might have difficulties to read some dependencies.
When it happens, a warn will be printed in the console.
With jest, this warn might be quite big because it's console also print the place where the warn has happened. (Switch to vitest ? :p)

## How to contribute

I tried as much as I could to stay close to the original ArchUnit code.
If something you would like is missing, check ArchUnit implementation and make a merge request.

### Get project

Go to the [arch-unit-ts](https://github.com/teyma/arch-unit-ts) project and click on the "fork" button.
You can then clone your own fork of the project, and start working on it.

[Please read the GitHub forking documentation for more information](https://help.github.com/articles/fork-a-repo)

Using SSH:

```
git clone git@github.com:<YOUR_USERNAME>/arch-unit-ts.git
```

Using HTTPS:

```
git clone https://github.com/<YOUR_USERNAME>/arch-unit-ts.git
```

Then, go inside your fork and add upstream:

Using SSH:

```
git remote add upstream git@github.com:teyma/arch-unit-ts.git
```

Using HTTPS:

```
git remote add upstream https://github.com/teyma/arch-unit-ts.git
```

The result of remote should be:

```
$ git remote -v
origin	git@github.com:<YOUR_USERNAME>/arch-unit-ts.git (fetch)
origin	git@github.com:<YOUR_USERNAME>/arch-unit-ts.git (push)
upstream	git@github.com:jhipster/arch-unit-ts.git (fetch)
upstream	git@github.com:jhipster/arch-unit-ts.git (push)
```

You can edit your `.git/config`, and update this section:

```
[remote "upstream"]
	url = git@github.com:teyma/arch-unit-ts.git
	fetch = +refs/heads/*:refs/remotes/upstream/*
	fetch = +refs/pull/*/head:refs/remotes/upstream/pr/*
```

With this change, you'll be able to use `git fetch upstream` and test all existing pull requests, using `git switch pr/<number>`.

### Run it

```
npm install
```

```
npm test
```

### [Submitting a Pull Request](https://opensource.guide/how-to-contribute/#opening-a-pull-request)

Before you submit your pull request consider the following guidelines:

- Search [GitHub](https://github.com/teyma/arch-unit-ts) for an open or closed Pull Request that relates to your submission
- Refresh your project

  ```shell
  git switch main
  git fetch upstream
  git rebase upstream/main
  ```

- Make your changes in a new git branch

  ```shell
  git switch -c my-fix-branch
  ```

- Create your patch, **including appropriate test cases**.
- Launch all tests

- ```shell
  npm test
  ```

- Commit your changes using a descriptive commit message

  ```shell
  git commit -a
  ```

  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

- Push your branch to GitHub:

  ```shell
  git push -u origin my-fix-branch
  ```

- In GitHub, send a pull request to `teyma/arch-unit-ts:main`.
- If we suggest changes then

  - Make the required updates.
  - Re-run the tests
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git fetch upstream
    git rebase upstream/main -i
    git push -f origin my-fix-branch
    ```

That's it! Thank you for your contribution!
