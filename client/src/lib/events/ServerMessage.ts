import ClientMessage from "./ClientMessage";
import MessageInfo from "../models/MessageInfo";

class ServerMessage extends ClientMessage{
    public static eventName = 'serverMessage'

    constructor(clientMessage: ClientMessage, public readonly messageInfo: MessageInfo) {
        super(clientMessage.text, clientMessage.room, clientMessage.user)
    }

    type(): string {
        return ServerMessage.eventName;
    }
}

export default ServerMessage