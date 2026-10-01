import { SliceIdentifier } from '../../../../../../main/arch-unit/library/dependencies/SliceIdentifier';

describe('SliceIdentifier', () => {
  it('should name a slice identified by one part with this part', () => {
    expect(SliceIdentifier.of('billing').getName()).toEqual('billing');
  });

  it('should join the parts with a dot to name a slice', () => {
    expect(SliceIdentifier.of('billing', 'order-mgmt').getName()).toEqual('billing.order-mgmt');
  });

  it('should expose a copy of its parts', () => {
    const identifier = SliceIdentifier.of('billing', 'orders');

    identifier.getParts().push('hacked');

    expect(identifier.getParts()).toEqual(['billing', 'orders']);
  });

  it('should reject an identifier without any part', () => {
    expect(() => SliceIdentifier.of()).toThrow('parts size should not be less than 1');
  });
});
