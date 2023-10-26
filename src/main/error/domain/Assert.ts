export class Assert {
  static notNullOrUndefined(field: string, input: unknown) {
    if (input == null) {
      throw new Error(`${field} should not be null`);
    }
  }

  static notBlank(field: string, input: string): void {
    Assert.notNullOrUndefined(field, input);
    if (input.trim().length === 0) {
      throw new Error(`${field} should not be blank`);
    }
  }

  static maxLength(field: string, input: string, length: number): void {
    if (input.length && input.length > length) {
      throw new Error(`${field} should not exceed ${length} characters`);
    }
  }

  static positive(field: string, input: number) {
    if (input < 0) {
      throw new Error(`${field} should be a positive number`);
    }
  }

  static max(field: string, value: number, max: number) {
    if (value > max) {
      throw new Error(`${field} should not exceed ${max}`);
    }
  }

  static min(field: string, value: number, min: number) {
    if (value < min) {
      throw new Error(`${field} should not be less than ${min}`);
    }
  }

  static minLength(field: string, input: string, length: number) {
    if (input.length && input.length < length) {
      throw new Error(`${field} should not have less than ${length} characters`);
    }
  }

  static path(field: string, path: string) {
    this.notBlank(field, path);
    if (!new RegExp('^(?:/[a-zA-Z0-9_-]+)*/?[a-zA-Z0-9_-]+(?:/[a-zA-Z0-9_-]+)*$').test(path)) {
      throw new Error(`${field} should be a path`);
    }
  }
}
