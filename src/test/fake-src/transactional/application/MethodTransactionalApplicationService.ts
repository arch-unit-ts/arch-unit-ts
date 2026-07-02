import { Transactional } from '../decorator/Transactional';

export class MethodTransactionalApplicationService {
  @Transactional()
  doSomething(): void {}

  @Transactional()
  getResult(): string {
    return 'result';
  }

  private privateMethod(): void {}
}
