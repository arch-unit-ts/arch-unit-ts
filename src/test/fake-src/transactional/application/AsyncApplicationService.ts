import { Transactional } from '../decorator/Transactional';

export class AsyncApplicationService {
  @Transactional()
  async doSomethingAsync(): Promise<void> {}

  async doSomethingAsyncWithoutDecorator(): Promise<void> {}

  doSomethingSync(): void {}
}
