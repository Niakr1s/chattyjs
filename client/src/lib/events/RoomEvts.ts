import IEvent from "./IEvent";

export class RoomAddedEvt implements IEvent {
    public static readonly emitName = 'roomAdded'

    constructor(public readonly roomName: string) {}

    type(): string {
        return RoomAddedEvt.emitName;
    }
}

export class RoomRemovedEvt implements IEvent {
    public static readonly emitName = 'roomRemoved'

    constructor(public readonly roomName: string) {}

    type(): string {
        return RoomRemovedEvt.emitName;
    }
}