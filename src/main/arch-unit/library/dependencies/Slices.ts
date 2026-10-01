import { Optional } from '../../../common/domain/Optional';
import { TypeScriptClass, TypeScriptClasses } from '../../core/domain/TypeScriptClass';

import { Slice } from './Slice';
import { SliceAssignment } from './SliceAssignment';
import { SliceIdentifier } from './SliceIdentifier';

export class Slices {
  private readonly slicesByName: Map<string, Slice>;
  private readonly assignment: SliceAssignment;
  private readonly classesByPath: Map<string, TypeScriptClass>;

  private constructor(slicesByName: Map<string, Slice>, assignment: SliceAssignment, classesByPath: Map<string, TypeScriptClass>) {
    this.slicesByName = slicesByName;
    this.assignment = assignment;
    this.classesByPath = classesByPath;
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

    const classesByPath = new Map(classes.get().map(typeScriptClass => [typeScriptClass.getPath().get(), typeScriptClass]));

    return new Slices(slicesByName, assignment, classesByPath);
  }

  getSlices(): Slice[] {
    return [...this.slicesByName.values()];
  }

  isEmpty(): boolean {
    return this.slicesByName.size === 0;
  }

  /**
   * The target of a dependency is a class without source file nor decorators: the assignment is given the class of the analysed set
   * with the same path when there is one, so that it can rely on everything a class exposes.
   */
  sliceOf(typeScriptClass: TypeScriptClass): Optional<Slice> {
    return this.assignment
      .getIdentifierOf(this.classesByPath.get(typeScriptClass.getPath().get()) ?? typeScriptClass)
      .flatMap(identifier => Optional.ofUndefinable(this.slicesByName.get(identifier.getName())));
  }

  getDescription(): string {
    return this.assignment.getDescription();
  }
}
