import { GivenArchitecture } from '../../../../../main/arch-unit/domain/fluentapi/GivenArchitecture';
import { LayerDefinition } from '../../../../../main/arch-unit/domain/fluentapi/LayerDefinition';
import { LayerName } from '../../../../../main/arch-unit/domain/fluentapi/LayerName';
import { PackageIdentifier } from '../../../../../main/arch-unit/domain/fluentapi/PackageIdentifier';
import { EMPTY_STRINGS } from '../../fixture.config';

describe('GivenArchitecture', () => {
  describe('consideringOnlyDependenciesInAnyPackage', () => {
    it('Should return itself', () => {
      const givenArchitecture = new GivenArchitecture();
      expect(givenArchitecture.consideringOnlyDependenciesInAnyPackage('package')).toEqual(givenArchitecture);
    });
  });

  describe('layer', () => {
    it('Should return itself', () => {
      const givenArchitecture = new GivenArchitecture();
      expect(givenArchitecture.consideringOnlyDependenciesInAnyPackage('package').layer('layer')).toEqual(givenArchitecture);
    });
    it('Should get layer', () => {
      const givenArchitecture = new GivenArchitecture();
      expect(
        givenArchitecture.consideringOnlyDependenciesInAnyPackage('package').layer('layer').currentLayerName.orElseThrow().get()
      ).toEqual('layer');
    });

    it('Should get multiple layers', () => {
      const givenArchitecture = new GivenArchitecture();
      const layersDefinition = [
        LayerDefinition.of(LayerName.of('domain'), PackageIdentifier.of('/fake-context/domain/**')),
        LayerDefinition.of(LayerName.of('primary adapter'), PackageIdentifier.of('/fake-context/infrastructure/primary/**')),
      ];
      expect(
        givenArchitecture
          .consideringOnlyDependenciesInAnyPackage('fake-context')
          .layer('domain')
          .definedBy('/fake-context/domain/**')
          .layer('primary adapter')
          .definedBy('/fake-context/infrastructure/primary/**').layers
      ).toEqual(layersDefinition);
    });

    it('Should set layer definition', () => {
      const givenArchitecture = new GivenArchitecture();
      const layerDefinition = LayerDefinition.of(LayerName.of('layer'), PackageIdentifier.of('package/identifier/**'));
      expect(
        givenArchitecture.consideringOnlyDependenciesInAnyPackage('package').layer('layer').definedBy('package/identifier/**').layers
      ).toEqual([layerDefinition]);
    });
  });

  describe('because', () => {
    it.each([...EMPTY_STRINGS])('should throw for %s', blank => {
      const givenClasses = new GivenArchitecture();
      expect(() => givenClasses.because(blank)).toThrow('The reason should not be blank.');
    });

    it('Should return itself and set reason of failure', () => {
      const givenClasses = new GivenArchitecture();
      expect(givenClasses.because('That is why I failed')).toEqual(givenClasses);
      expect(givenClasses.reason.orElseThrow().get()).toEqual('That is why I failed');
    });
  });

  describe('definedBy', () => {
    it('Should return itself', () => {
      const givenArchitecture = new GivenArchitecture();
      expect(
        givenArchitecture.consideringOnlyDependenciesInAnyPackage('package').layer('layer').definedBy('package/identifier/**')
      ).toEqual(givenArchitecture);
    });

    it('Should set layer before its definition', () => {
      const givenArchitecture = new GivenArchitecture();
      expect(() => {
        givenArchitecture.consideringOnlyDependenciesInAnyPackage('package').definedBy('package/identifier/**');
      }).toThrow('The layer need to be declared before its definition');
    });
  });
});
