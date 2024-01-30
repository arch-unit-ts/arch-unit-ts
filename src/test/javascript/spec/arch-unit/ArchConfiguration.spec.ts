import { ArchConfiguration } from '../../../../main/arch-unit/ArchConfiguration';

describe('ArchConfiguration', () => {
  console.warn = jest.fn();

  it('should load configuration', () => {
    const archConfiguration = ArchConfiguration.get();
    expect(archConfiguration.showImportsWarning).toEqual(true);
    expect(archConfiguration.failOnEmptyShould).toEqual(false);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should load default configuration when file not found', () => {
    const archConfiguration = ArchConfiguration.getFromPath('notAValidPath.json');
    expect(archConfiguration.showImportsWarning).toEqual(true);
    expect(archConfiguration.failOnEmptyShould).toEqual(false);

    expect(console.warn).toHaveBeenCalledWith('No configuration found in classpath at notAValidPath.json => Using default configuration');
  });
});
