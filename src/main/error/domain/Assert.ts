export class Assert {
  static notNullOrUndefined(field: string, input: unknown) {
    if (input == null) {
      throw new Error(`${field} should not be null or undefined`);
    }
  }

  static notBlank(field: string, input: string): void {
    Assert.notNullOrUndefined(field, input);
    if (input.trim().length === 0) {
      throw new Error(`${field} should not be blank`);
    }
  }

  static path(field: string, path: string) {
    this.notBlank(field, path);
    const filePathPattern: RegExp = /^(\/?[a-zA-Z0-9_@-]+)+(\.[a-zA-Z]+)*$/;

    if (!filePathPattern.test(path)) {
      throw new Error(`${field} '${path}' should be a path`);
    }
  }

  static min(field: string, value: number, min: number) {
    if (value < min) {
      throw new Error(`${field} should not be less than ${min}`);
    }
  }

  static notEmpty(field: string, collection: unknown[]) {
    Assert.notNullOrUndefined(field, collection);
    Assert.min(`${field} size`, collection.length, 1);
  }
}
