import ClientStore from "./ClientStore";
import RoomStore from "./RoomStore";
import Client from "./Client";
import JoinEvt from "../../../client/src/lib/events/JoinEvt";
import EmitCallbackFn from "../../../client/src/lib/socket/EmitCallbackFn";
import EmitResult from "../../../client/src/lib/socket/EmitResult";
import ClientMessage from "../../../client/src/lib/events/ClientMessage";
import ServerMessage from "../../../client/src/lib/events/ServerMessage";
import MessageInfo from "../../../client/src/lib/models/MessageInfo";
import {RoomAddedEvt, RoomRemovedEvt} from "../../../client/src/lib/events/RoomEvts";

export default class Store {
    private _clientStore = new ClientStore()
    private _roomStore = new RoomStore()

    constructor() {
        this._roomStore.on(RoomAddedEvt.emitName, (evt: RoomAddedEvt) => {
            this._clientStore.emitAll(evt.type(), evt)
        })
        this._roomStore.on(RoomRemovedEvt.emitName, (evt: RoomRemovedEvt) => {
            this._clientStore.emitAll(evt.type(), evt)
        })
    }

    public addClient = (client: Client): Promise<void> => {
        return new Promise((resolve, reject) => {
            this._clientStore.addClient(client)
                .catch(err => {reject(err)})
                .then(() => { this.connect(client) })
        })
    }

    private connect = (client: Client) => {
        client.socket.on('disconnect', () => {
            console.log('Store: disconnected', client.user)
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
            let room = this._roomStore.getRoom(clientMessage.room.name)
            if (!room) return callback(new EmitResult('no such room'))
            this._clientStore.emitUsers(Object.keys(room), ServerMessage.eventName, serverMessage)
            callback(new EmitResult())
        })
    }
}