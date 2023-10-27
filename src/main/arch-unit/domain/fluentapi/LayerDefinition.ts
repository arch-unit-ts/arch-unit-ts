import { LayerName } from './LayerName';
import { PackageIdentifier } from './PackageIdentifier';

export class LayerDefinition {
  private readonly _layerName: LayerName;
  private readonly _packageIdentifier: PackageIdentifier;

  private constructor(layerName: LayerName, packageIdentifier: PackageIdentifier) {
    this._layerName = layerName;
    this._packageIdentifier = packageIdentifier;
  }

  layerName(): LayerName {
    return this._layerName;
  }

  packageIdentifier(): PackageIdentifier {
    return this._packageIdentifier;
  }

  static of(layerName: LayerName, packageIdentifier: PackageIdentifier): LayerDefinition {
    return new LayerDefinition(layerName, packageIdentifier);
  }
}
