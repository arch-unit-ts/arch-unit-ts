import { Assert } from '@/error/domain/Assert';

export class LayerName {
  private readonly layerName: string;

  constructor(layerName: string) {
    Assert.notBlank('layerName', layerName);
    this.layerName = layerName.trim();
  }

  static of(layerName: string): LayerName {
    return new LayerName(layerName);
  }

  get(): string {
    return this.layerName;
  }
}
