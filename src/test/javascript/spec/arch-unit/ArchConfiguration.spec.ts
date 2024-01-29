import { ArchConfiguration } from '../../../../main/arch-unit/ArchConfiguration';

describe('ArchConfiguration', () => {
  console.warn = jest.fn();

  it('should load configuration', () => {
    expect(ArchConfiguration.get().showImportsWarning).toEqual(true);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should load default configuration when file not found', () => {
    expect(ArchConfiguration.getFromPath('notAValidPath.json'));

    expect(console.warn).toHaveBeenCalledWith('No configuration found in classpath at notAValidPath.json => Using default configuration');
  });
});
