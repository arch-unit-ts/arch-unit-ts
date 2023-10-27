import { PackageName } from '../PackageName';
import { TypeScriptPackage } from '../TypeScriptPackage';
import { TypeScriptProject } from '../TypeScriptProject';

import { LayerDefinition } from './LayerDefinition';
import { LayerName } from './LayerName';
import { PackageIdentifier } from './PackageIdentifier';

import { Reason } from '@/arch-unit/domain/fluentapi/Reason';
import { Optional } from '@/common/domain/Optional';

export class GivenArchitecture {
  public packageNameToCheck: Optional<PackageName> = Optional.empty();
  public currentLayerName: Optional<LayerName> = Optional.empty();
  public layers: LayerDefinition[] = [];

  public reason: Optional<Reason> = Optional.empty();

  consideringOnlyDependenciesInAnyPackage(packageNameToCheck: string) {
    this.packageNameToCheck = Optional.of(PackageName.of(packageNameToCheck));
    return this;
  }

  layer(name: string) {
    this.currentLayerName = Optional.of(LayerName.of(name));
    return this;
  }

  definedBy(packageIdentifierRaw: string) {
    const packageIdentifier = PackageIdentifier.of(packageIdentifierRaw);
    const currentLayerName = this.currentLayerName.orElseThrow(() => new Error('The layer need to be declared before its definition'));
    this.layers.push(LayerDefinition.of(currentLayerName, packageIdentifier));
    return this;
  }

  because(reason: string): GivenArchitecture {
    try {
      this.reason = Optional.of(Reason.of(reason));
      return this;
    } catch (e) {
      throw new Error('The reason should not be blank.');
    }
  }

  check(project: TypeScriptProject): void {
    if (!this.layers.every(layer => this.directoryHasPath(project.get(), layer, 0))) {
      throw new Error(this.reason.orElseThrow().get());
    }
  }

  private directoryHasPath(currentPackage: TypeScriptPackage, layerDefinition: LayerDefinition, index: number): boolean {
    const path = layerDefinition.packageIdentifier().get().split('/');
    const currentSubPackage = path[index];
    if (currentSubPackage === '**') {
      return true;
    }

    const subPackage = currentPackage.getPackage(PackageName.of(currentSubPackage));
    if (subPackage.isEmpty()) {
      return subPackage.isPresent();
    }
    //if (index + 1 >= path.length) return subPackage.isPresent();

    return this.directoryHasPath(subPackage.orElseThrow(), layerDefinition, index + 1);
  }
}
