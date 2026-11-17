import { SlicesCreatorInternal } from './SlicesCreatorInternal';

export abstract class SlicesRuleDefinition {
  public static slices = (): SlicesCreatorInternal => {
    return new SlicesCreatorInternal();
  };
}
