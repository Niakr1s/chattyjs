import http from 'http'
import ExpressServer from "./server/ExpressServer";
import SocketServer from "./server/SocketServer";
import Client from "./store/Client";
import Store from "./store/Store";

class Server {
    private readonly _expressApp = new ExpressServer()
    private readonly _expressServer = http.createServer(this._expressApp.app)
    private readonly _socketServer = new SocketServer(this._expressServer)
    private readonly _store = new Store()

    public start = (port = 5000) => {
        this._socketServer.connect((client: Client) => {
            this._store.addClient(client)
                .catch(() => {client.socket.disconnect(true)})
        })
        this._expressServer.listen(port, () => console.log(`Server started at ${port}`))
    }
}

export default Server