# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`arch-unit-ts` is a TypeScript library for enforcing architecture rules in TS projects, inspired by [ArchUnit](https://github.com/TNG/ArchUnit) for Java. It uses `ts-morph` to statically analyze imports and package structures, then exposes a fluent DSL to write rules like:

```ts
noClasses()
  .that()
  .resideInAPackage('..application..')
  .should()
  .dependOnClassesThat()
  .resideInAnyPackage('..infrastructure..')
  .check(project.allClasses());
```

## Commands

```bash
npm run build          # Compile TypeScript to dist/
npm test               # Run all tests (jest with --maxWorkers=2 --no-cache)
npm run test:watch     # Jest watch mode
npm run format:check   # Prettier + ESLint check
npm run eslint:fix     # Auto-fix ESLint issues
npm run prettier:format # Auto-format with Prettier
npm run dopublish      # Build and publish to npm
```

**Run a single test file:**

```bash
npm test -- src/test/javascript/spec/arch-unit/lang/ArchRuleDefinition.spec.ts
```

**Run a single test by name:**

```bash
npm test -- --testNamePattern="should check hexagonal"
```

CI also runs `npx madge --circular --extensions ts ./` to detect circular dependencies.

## Architecture

### Source layout

```
src/main/
  arch-unit/
    base/          # Core abstractions: DescribedPredicate, ChainableFunction, ArchFunction
    core/domain/   # Domain model: TypeScriptProject, TypeScriptClass, TypeScriptPackage, PackageMatcher
    lang/          # DSL engine: ArchRule, ArchCondition, ConditionEvents, ClassesTransformer
      conditions/  # Built-in predicates (ArchConditions, ArchPredicates) and event aggregators
      synthax/     # Fluent API implementation (GivenClassesInternal, ClassesThatInternal, ClassesShouldInternal)
        elements/  # Public DSL interfaces: GivenClasses, ClassesThat, ClassesShould
    library/       # High-level APIs: Architectures (layeredArchitecture)
  common/domain/   # Optional<T>, BooleanUtils
  error/domain/    # Assert (input validation)
  main.ts          # Public entry: exports classes() and noClasses()
```

### How the DSL works

The fluent API follows this chain:

1. `classes()` / `noClasses()` → `GivenClasses` (from `ArchRuleDefinition`)
2. `.that()` → `ClassesThat` (filter selector using `DescribedPredicate`)
3. `.should()` → `ClassesShould` (condition builder using `ArchCondition`)
4. `.check(allClasses)` → evaluates the rule, throws on violations

Internally, `ClassesThatInternal` accumulates predicates via `PredicateAggregator`, and `ClassesShouldInternal` accumulates conditions via `ConditionAggregator`. The `ClassesTransformer` applies filters; `ConditionEvents` collects violations per class.

### TypeScriptProject and TypeScriptClass

`TypeScriptProject` (in `core/domain/`) is the scanner: it wraps `ts-morph` to load source files from a relative path (relative to `tsconfig.json`). Glob patterns can be passed to exclude files.

`TypeScriptClass` represents one source file. Key properties:

- `packagePath` — directory path expressed with dots
- `imports` — set of imported class/type names (resolved by ts-morph)
- Memoization via `typescript-memoize` on expensive computations

### Package matching

`PackageMatcher` supports ArchUnit-style patterns with `..` as wildcard segments (e.g., `..domain..`, `com.example..`). `PackageMatchers` combines multiple patterns with OR semantics.

### Test fixtures

`src/test/fake-src/` contains fake TypeScript source trees used in integration tests. `src/test/hexagonal/` contains `BusinessContext.ts` and `SharedKernel.ts` base classes used by the hexagonal arch test fixture.

### Coverage requirement

Tests require **100% coverage** (statements, branches, functions, lines) — enforced by Jest config. The only exclusions are `src/main/main.ts` and any hexagonal domain files.

## Path alias

`@/*` maps to `src/main/*` (configured in both `tsconfig.json` and `jest.config.js`).

## Publishing

The library entry point is `dist/main.js`. Consumers import from paths like `arch-unit-ts/dist/arch-unit/core/domain/TypeScriptProject`. The `typings` field in `package.json` points to `src/main/main.ts`.
