export abstract class BooleanUtils {
  public static falseIfUndefined(property: boolean) {
    return property ?? false;
  }
}
