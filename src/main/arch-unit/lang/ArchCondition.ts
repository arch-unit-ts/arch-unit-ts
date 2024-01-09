import { Assert } from '../../error/domain/Assert';
import { DescribedPredicate } from '../base/DescribedPredicate';
import { TypeScriptClass } from '../core/domain/TypeScriptClass';

import { ConditionEvent } from './ConditionEvent';
import { ConditionEvents } from './ConditionEvents';
import { ViolatedAndSatisfiedConditionEvents } from './conditions/ViolatedAndSatisfiedConditionEvents';
import { SimpleConditionEvent } from './SimpleConditionEvent';

export abstract class ArchCondition<T> {
  readonly description: string;

  protected constructor(description: string) {
    this.description = description;
  }

  abstract check(item: T, events: ConditionEvents): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  finish(events: ConditionEvents): void {}

  and(condition: ArchCondition<T>): ArchCondition<T> {
    return new AndCondition(this, condition);
  }

  or(condition: ArchCondition<T>): ArchCondition<T> {
    return new OrCondition(this, condition);
  }

  static from(predicate: DescribedPredicate<TypeScriptClass>): ConditionByPredicate {
    return ConditionByPredicate.of(predicate);
  }

  as(description: string): ArchCondition<T> {
    return new AsCondition(this, description);
  }
}

class AsCondition<T> extends ArchCondition<T> {
  private readonly condition: ArchCondition<T>;

  constructor(condition: ArchCondition<T>, description: string) {
    Assert.notNullOrUndefined('condition', condition);
    super(description);
    this.condition = condition;
  }

  check(item: T, events: ConditionEvents): void {
    this.condition.check(item, events);
  }
}

abstract class JoinCondition<T> extends ArchCondition<T> {
  private readonly conditions: ArchCondition<T>[];

  protected constructor(infix: string, conditions: ArchCondition<T>[]) {
    super(JoinCondition.joinDescriptionsOf(infix, conditions));
    this.conditions = conditions;
  }

  evaluateConditions(item: T): ConditionWithEvents<T>[] {
    return this.conditions.map(condition => ConditionWithEvents.of(condition, item));
  }

  private static joinDescriptionsOf<T>(infix: string, conditions: ArchCondition<T>[]): string {
    return conditions.map(condition => condition.description).join(' ' + infix + ' ');
  }
}

abstract class JoinConditionEvent<T> implements ConditionEvent {
  readonly correspondingObject: T;

  readonly evaluatedConditions: ConditionWithEvents<T>[];

  protected constructor(correspondingObject: T, evaluatedConditions: ConditionWithEvents<T>[]) {
    this.correspondingObject = correspondingObject;
    this.evaluatedConditions = evaluatedConditions;
  }

  abstract isViolation(): boolean;

  abstract getDescriptionLines(): string[];

  abstract invert(): ConditionEvent;

  getUniqueLinesOfViolations(): string[] {
    const result = new Set<string>();
    for (const evaluation of this.evaluatedConditions) {
      for (const event of evaluation.events.getViolating()) {
        event.getDescriptionLines().forEach(line => result.add(line));
      }
    }
    return Array.from(result);
  }

  invertConditionWithEventsArray(evaluatedConditions: ConditionWithEvents<T>[]): ConditionWithEvents<T>[] {
    return evaluatedConditions.map(conditionWithEvents => this.invertConditionWithEvents(conditionWithEvents));
  }

  private invertConditionWithEvents(evaluation: ConditionWithEvents<T>): ConditionWithEvents<T> {
    const invertedEvents: ViolatedAndSatisfiedConditionEvents = new ViolatedAndSatisfiedConditionEvents();
    [...evaluation.events.getViolating(), ...(evaluation.events as ViolatedAndSatisfiedConditionEvents).getAllowed()].forEach(event =>
      invertedEvents.add(event.invert())
    );
    return new ConditionWithEvents(evaluation.condition, invertedEvents);
  }
}

class OrCondition<T> extends JoinCondition<T> {
  private readonly current: ArchCondition<T>;
  private readonly other: ArchCondition<T>;

  constructor(current: ArchCondition<T>, other: ArchCondition<T>) {
    Assert.notNullOrUndefined('current', current);
    Assert.notNullOrUndefined('other', other);
    super('or', [current, other]);
    this.current = current;
    this.other = other;
  }

  check(item: T, events: ConditionEvents): void {
    events.add(new OrConditionEvent(item, super.evaluateConditions(item)));
  }
}

class OrConditionEvent<T> extends JoinConditionEvent<T> {
  constructor(item: T, evaluatedConditions: ConditionWithEvents<T>[]) {
    super(item, evaluatedConditions);
  }

  isViolation() {
    return this.evaluatedConditions.every(evaluation => evaluation.events.containViolation());
  }

  invert(): ConditionEvent {
    return new AndConditionEvent(this.correspondingObject, super.invertConditionWithEventsArray(this.evaluatedConditions));
  }

  public getDescriptionLines(): string[] {
    return super.getUniqueLinesOfViolations();
  }
}

class AndCondition<T> extends JoinCondition<T> {
  private readonly current: ArchCondition<T>;
  private readonly other: ArchCondition<T>;

  constructor(current: ArchCondition<T>, other: ArchCondition<T>) {
    Assert.notNullOrUndefined('current', current);
    Assert.notNullOrUndefined('other', other);
    super('and', [current, other]);
    this.current = current;
    this.other = other;
  }

  check(item: T, events: ConditionEvents): void {
    events.add(new AndConditionEvent(item, super.evaluateConditions(item)));
  }
}

class AndConditionEvent<T> extends JoinConditionEvent<T> {
  constructor(item: T, evaluatedConditions: ConditionWithEvents<T>[]) {
    super(item, evaluatedConditions);
  }

  isViolation() {
    return this.evaluatedConditions.some(evaluation => evaluation.events.containViolation());
  }

  invert(): ConditionEvent {
    return new OrConditionEvent(this.correspondingObject, super.invertConditionWithEventsArray(this.evaluatedConditions));
  }

  getDescriptionLines(): string[] {
    return super.getUniqueLinesOfViolations();
  }
}

class ConditionWithEvents<T> {
  readonly condition: ArchCondition<T>;
  readonly events: ViolatedAndSatisfiedConditionEvents;

  constructor(condition: ArchCondition<T>, events: ViolatedAndSatisfiedConditionEvents) {
    this.condition = condition;
    this.events = events;
  }

  static of<T>(condition: ArchCondition<T>, item: T) {
    return new ConditionWithEvents(condition, this.check(condition, item));
  }

  private static check<T>(condition: ArchCondition<T>, item: T): ViolatedAndSatisfiedConditionEvents {
    const events: ViolatedAndSatisfiedConditionEvents = new ViolatedAndSatisfiedConditionEvents();
    condition.check(item, events);
    return events;
  }
}

export class ConditionByPredicate extends ArchCondition<TypeScriptClass> {
  private readonly predicate: DescribedPredicate<TypeScriptClass>;
  private readonly eventDescriber: (predicateDescription: string, satisfied: boolean) => string;

  public static of(predicate: DescribedPredicate<TypeScriptClass>) {
    return new ConditionByPredicate(
      predicate,
      predicate.description,
      (predicateDescription, satisfied) => (satisfied ? 'has ' : 'does not have ') + predicateDescription
    );
  }

  private constructor(
    predicate: DescribedPredicate<TypeScriptClass>,
    description: string,
    eventDescriber: (predicateDescription: string, satisfied: boolean) => string
  ) {
    super(description);
    this.predicate = predicate;
    this.eventDescriber = eventDescriber;
  }

  public as(description: string): ConditionByPredicate {
    return new ConditionByPredicate(this.predicate, description, this.eventDescriber);
  }

  public check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    const satisfied: boolean = this.predicate.test(typeScriptClass);
    const message: string =
      typeScriptClass.name.get() +
      ' ' +
      this.eventDescriber.apply(this, [this.predicate.description, satisfied]) +
      ' in ' +
      typeScriptClass.getPath().get();
    events.add(new SimpleConditionEvent(message, !satisfied));
  }
}
