import { Formatters } from '../../../../../../main/arch-unit/core/domain/Formatters';

describe('Formatters', () => {
  const dataJoinSingleQuoted = [
    [[''], "''"],
    [['one'], "'one'"],
    [['one', 'two'], "'one', 'two'"],
    [['one', 'two', 'three'], "'one', 'two', 'three'"],
    [['', ''], "'', ''"],
  ];
  it.each(dataJoinSingleQuoted)('join single quoted', (packageNames: string[], result: string) => {
    expect(Formatters.joinSingleQuoted(...packageNames)).toEqual(result);
  });
});
