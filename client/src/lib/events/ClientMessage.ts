import Room from "../models/Room";
import Text from "../models/Text";
import IEvent from "./IEvent";
import User from "../models/User";

class ClientMessage implements IEvent {
    public static eventName = 'clientMessage'

    constructor(public readonly text: Text, public readonly room: Room, public readonly user: User) { }

    type(): string {
        return ClientMessage.eventName;
    }
}

export default ClientMessage