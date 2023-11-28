import { Assert } from '../../../../error/domain/Assert';

import { ConditionEvent } from './ConditionEvent';
import { ConditionEvents } from './ConditionEvents';
import { ViolatedAndSatisfiedConditionEvents } from './ViolatedAndSatisfiedConditionEvents';

export abstract class ArchCondition<T> {
  readonly description: string;

  protected constructor(description: string) {
    this.description = description;
  }

  abstract check(item: T, events: ConditionEvents): void;

  and(condition: ArchCondition<T>): ArchCondition<T> {
    return new AndCondition(this, condition);
  }

  or(condition: ArchCondition<T>): ArchCondition<T> {
    return new OrCondition(this, condition);
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
