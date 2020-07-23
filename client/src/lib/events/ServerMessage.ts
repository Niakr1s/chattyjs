import ClientMessage from "./ClientMessage";
import MessageInfo from "../models/MessageInfo";

class ServerMessage extends ClientMessage{
    public static eventName = 'serverMessage'

    constructor({text, room, user}: ClientMessage, public readonly messageInfo: MessageInfo) {
        super(text, room, user)
    }

    type(): string {
        return ServerMessage.eventName;
    }
}

export default ServerMessage