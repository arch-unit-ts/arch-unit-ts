import { NotTransactional } from '../decorator/NotTransactional';

export class NotTransactionalApplicationService {
  @NotTransactional()
  readOnly(): string {
    return 'read-only result';
  }
}
