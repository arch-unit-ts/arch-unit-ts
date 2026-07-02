import { Transactional } from '../decorator/Transactional';

@Transactional()
export class ClassTransactionalApplicationService {
  doSomething(): void {}

  getResult(): string {
    return 'result';
  }
}
