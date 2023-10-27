import { LayerDefinition } from '../../../../../main/arch-unit/domain/fluentapi/LayerDefinition';
import { LayerName } from '../../../../../main/arch-unit/domain/fluentapi/LayerName';
import { PackageIdentifier } from '../../../../../main/arch-unit/domain/fluentapi/PackageIdentifier';

describe('LayerDefinition', () => {
  it('Should get', () => {
    const layerName = LayerName.of('context-one');
    const packageIdentifier = PackageIdentifier.of('context-one/domain/**');
    const layerDefinition = LayerDefinition.of(layerName, packageIdentifier);
    expect(layerDefinition.layerName()).toEqual(layerName);
    expect(layerDefinition.packageIdentifier()).toEqual(packageIdentifier);
  });
});
