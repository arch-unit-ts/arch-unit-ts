// eslint-disable-next-line import/no-unresolved
import { Sheep } from './Sheep';

export class FileWithUnknownImport {
  private readonly sheep: Sheep;

  constructor(sheep: Sheep) {
    this.sheep = sheep;
  }
}
