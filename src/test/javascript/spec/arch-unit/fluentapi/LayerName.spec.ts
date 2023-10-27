import { LayerName } from '../../../../../main/arch-unit/domain/fluentapi/LayerName';
import { EMPTY_STRINGS } from '../../fixture.config';

describe('LayerName', () => {
  it.each(EMPTY_STRINGS)('should not build for "%s"', layerName => {
    expect(() => LayerName.of(layerName)).toThrow('layerName should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', layerName => {
    expect(LayerName.of(layerName).get()).toEqual('test');
  });
});
