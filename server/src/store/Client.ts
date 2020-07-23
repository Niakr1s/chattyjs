import io from 'socket.io'
import User from "../../../client/src/lib/models/User";

class Client {
    private readonly _user: User;
    private readonly _socket: io.Socket;

    constructor(socket: io.Socket, user: User) {
        this._user = user
        this._socket = socket
    }

    get user(): User {
        return this._user;
    }

    get socket(): io.Socket {
        return this._socket;
    }
}

export default Client