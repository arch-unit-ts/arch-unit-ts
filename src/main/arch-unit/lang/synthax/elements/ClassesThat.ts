export interface ClassesThat<CONJUNCTION> {
  resideInAPackage(packageIdentifier: string): CONJUNCTION;

  resideInAnyPackage(...packageIdentifiers: string[]): CONJUNCTION;

  haveSimpleNameStartingWith(prefix: string): CONJUNCTION;

  haveSimpleNameEndingWith(prefix: string): CONJUNCTION;
}
