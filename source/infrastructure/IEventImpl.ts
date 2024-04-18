import {IEvent} from '../domain/context/IEvent';
import {ConnectionManager} from './ConnectionManager';
import {CommandResponse} from './repositoryimpl/CommandResponse';

export interface IEventImpl extends IEvent {
  execute(
    manager: ConnectionManager,
    event: IEvent
  ): Promise<CommandResponse.All>;
}
