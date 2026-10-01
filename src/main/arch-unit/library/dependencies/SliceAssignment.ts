import { Optional } from '../../../common/domain/Optional';
import { HasDescription } from '../../base/HasDescription';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';

import { SliceIdentifier } from './SliceIdentifier';

export interface SliceAssignment extends HasDescription {
  getIdentifierOf(typeScriptClass: TypeScriptClass): Optional<SliceIdentifier>;
}
