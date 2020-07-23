import http from 'http'
import io from 'socket.io'
import LoginEvt from "../../../client/src/lib/events/LoginEvt";
import Client from "../store/Client";

class SocketServer {
    private readonly _socket: io.Server

    constructor(server: http.Server) {
        this._socket = io(server)
    }

    public get socket() { return this._socket }

    public connect = (onNewClient: (Client) => void) => {
        this._socket.on("connect", socket => {
            socket.on(LoginEvt.eventName, (loginEvent: LoginEvt) => {
                const client = new Client(socket, loginEvent.user)
                onNewClient(client)
            })
            // socket.on(JoinEvt.eventName, (joinEvent: JoinEvt) => {
            //     console.log(JoinEvt.eventName, joinEvent)
            //     socket.join(joinEvent.room.name)
            // })
            // socket.on(MessageEvt.eventName, (messageEvent: MessageEvt, fn: EmitCallbackFn) => {
            //     console.log(MessageEvt.eventName, messageEvent)
            //     fn(new EmitResult())
            //     socket.in(messageEvent.room.name).emit('message', messageEvent)
            // })
        })
    }
}

export default SocketServer