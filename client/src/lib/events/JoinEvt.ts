import Room from "../models/Room";
import IEvent from "./IEvent";

class JoinEvt implements IEvent {
    public static readonly eventName = 'join'

    constructor(public readonly room: Room) {}

    type(): string {
        return JoinEvt.eventName;
    }
}

export default JoinEvt