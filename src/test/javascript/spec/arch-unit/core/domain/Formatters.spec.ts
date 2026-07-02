import { Formatters } from '../../../../../../main/arch-unit/core/domain/Formatters';

describe('Formatters', () => {
  const dataJoinSingleQuoted: [string[], string][] = [
    [[''], "''"],
    [['one'], "'one'"],
    [['one', 'two'], "'one', 'two'"],
    [['one', 'two', 'three'], "'one', 'two', 'three'"],
    [['', ''], "'', ''"],
  ];
  it.each(dataJoinSingleQuoted)('join single quoted', (packageNames, result) => {
    expect(Formatters.joinSingleQuoted(...packageNames)).toEqual(result);
  });
});
