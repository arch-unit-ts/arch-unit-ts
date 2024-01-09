import { FruitJson } from './FruitJson';

export class TypeScriptFruitsAdapter {
  getFruit(): FruitJson {
    return new FruitJson('BLUE');
  }
}
