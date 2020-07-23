import ClientStore from "./ClientStore";
import RoomStore from "./RoomStore";
import Client from "./Client";
import JoinEvt from "../../../client/src/lib/events/JoinEvt";
import EmitCallbackFn from "../../../client/src/lib/socket/EmitCallbackFn";
import EmitResult from "../../../client/src/lib/socket/EmitResult";
import ClientMessage from "../../../client/src/lib/events/ClientMessage";
import ServerMessage from "../../../client/src/lib/events/ServerMessage";
import MessageInfo from "../../../client/src/lib/models/MessageInfo";

export default class Store {
    private _clientStore = new ClientStore()
    private _roomStore = new RoomStore()

    constructor() {

    }

    public addClient = (client: Client): Promise<void> => {
        return new Promise((resolve, reject) => {
            this._clientStore.addClient(client)
                .catch(err => {reject(err)})
                .then(() => {
                    client.socket.on('disconnect', () => {
                        console.log('disconnected', client.user)
                        this._clientStore.removeClient(client)
                        this._roomStore.removeUser(client.user.name)
                    })
                    client.socket.on(JoinEvt.eventName, (joinEvent: JoinEvt, callback: EmitCallbackFn) => {
                        this._roomStore.joinRoom(joinEvent.room, client.user)
                            .then(() => {callback(new EmitResult())})
                            .catch(err => {callback(new EmitResult(err))})
                    })
                    client.socket.on(ClientMessage.eventName, (clientMessage: ClientMessage, callback: EmitCallbackFn) => {
                        let serverMessage = new ServerMessage(clientMessage, new MessageInfo(1, new Date()))
                        let room = this._roomStore.getRoom(clientMessage.room)
                        if (!room) return callback(new EmitResult('no such room'))
                        let userNames = Object.keys(room)
                        console.log(`Store: sending message`, serverMessage, `to clients`, userNames)
                        for (let username of userNames) {
                            let client = this._clientStore.getClient(username)
                            client?.socket.emit(ServerMessage.eventName, serverMessage)
                        }
                    })
                })
        })
    }
}