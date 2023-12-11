export class Formatters {
  public static joinSingleQuoted(...packageIdentifiers: string[]) {
    return packageIdentifiers.map(packageIdentifier => `'${packageIdentifier}'`).join(', ');
  }
}
