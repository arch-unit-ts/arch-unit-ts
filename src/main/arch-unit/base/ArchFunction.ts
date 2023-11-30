export interface ArchFunction<T, R> {
  apply(t: T): R;
}
