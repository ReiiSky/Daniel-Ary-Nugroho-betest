import {IEvent} from './IEvent';

export abstract class Aggregate {
  private _events: IEvent[];

  constructor() {
    this._events = [];
  }

  protected addEvent(event: IEvent) {
    this._events.push(event);
  }

  public get events(): IEvent[] {
    return [...this._events];
  }
}
