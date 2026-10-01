import { Optional } from '../../../common/domain/Optional';
import { TypeScriptClass, TypeScriptClasses } from '../../core/domain/TypeScriptClass';

import { Slice } from './Slice';
import { SliceAssignment } from './SliceAssignment';
import { SliceIdentifier } from './SliceIdentifier';

export class Slices {
  private readonly slicesByName: Map<string, Slice>;
  private readonly assignment: SliceAssignment;

  private constructor(slicesByName: Map<string, Slice>, assignment: SliceAssignment) {
    this.slicesByName = slicesByName;
    this.assignment = assignment;
  }

  static of(classes: TypeScriptClasses, assignment: SliceAssignment): Slices {
    const classesByIdentifier = new Map<string, { identifier: SliceIdentifier; classes: TypeScriptClass[] }>();

    classes.get().forEach(typeScriptClass =>
      assignment.getIdentifierOf(typeScriptClass).ifPresent(identifier => {
        const entry = classesByIdentifier.get(identifier.getName());
        if (entry) {
          entry.classes.push(typeScriptClass);
        } else {
          classesByIdentifier.set(identifier.getName(), { identifier, classes: [typeScriptClass] });
        }
      })
    );

    const slicesByName = new Map<string, Slice>();
    [...classesByIdentifier.keys()]
      .sort()
      .forEach(name =>
        slicesByName.set(name, new Slice(classesByIdentifier.get(name)!.identifier, classesByIdentifier.get(name)!.classes))
      );

    return new Slices(slicesByName, assignment);
  }

  getSlices(): Slice[] {
    return [...this.slicesByName.values()];
  }

  isEmpty(): boolean {
    return this.slicesByName.size === 0;
  }

  sliceOf(typeScriptClass: TypeScriptClass): Optional<Slice> {
    return this.assignment
      .getIdentifierOf(typeScriptClass)
      .flatMap(identifier => Optional.ofUndefinable(this.slicesByName.get(identifier.getName())));
  }

  getDescription(): string {
    return this.assignment.getDescription();
  }
}
