import { Reason } from '@/arch-unit/domain/fluentapi/Reason';
import { PackageName } from '@/arch-unit/domain/PackageName';
import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptProject } from '@/arch-unit/domain/TypeScriptProject';
import { Optional } from '@/common/domain/Optional';

export class GivenClasses {
  packageNameToCheck: Optional<PackageName> = Optional.empty();
  dependingOn: Optional<PackageName> = Optional.empty();
  reason: Optional<Reason> = Optional.empty();

  that(): GivenClasses {
    return this;
  }

  should(): GivenClasses {
    return this;
  }

  resideInAPackage(packageName: string): GivenClasses {
    try {
      this.packageNameToCheck = Optional.of(PackageName.of(packageName));
      return this;
    } catch (e) {
      throw new Error('The package name should not be blank.');
    }
  }

  onlyHaveDependentClassesThat(): GivenClasses {
    return this;
  }

  from(packageName: string) {
    try {
      this.dependingOn = Optional.of(PackageName.of(packageName));
      return this;
    } catch (e) {
      throw new Error('The package to check from should not be blank.');
    }
  }

  because(reason: string): GivenClasses {
    try {
      this.reason = Optional.of(Reason.of(reason));
      return this;
    } catch (e) {
      throw new Error('The reason should not be blank.');
    }
  }

  check(project: TypeScriptProject) {
    project
      .get()
      .getPackage(this.packageNameToCheck.orElseThrow(() => new Error('The package to check is needed.')))
      .ifPresent(directory => {
        const imports: Path[] = directory.allImports();
        const pathToCheck = project
          .get()
          .getPackage(this.dependingOn.orElseThrow())
          .map(directory => directory.path)
          .orElseThrow();
        const hasInvalidImport = imports.some(anImport => !anImport.contains(pathToCheck.get()));
        if (hasInvalidImport) {
          // FIXME Renvoyer la liste des fichier en erreur (nom + import en erreur)
          throw new Error(this.reason.orElseThrow().get());
        }
      });
  }
}
