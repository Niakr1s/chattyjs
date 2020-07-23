import http from 'http'
import io from 'socket.io'
import ExpressApp from "./ExpressApp";

class Server {
    private readonly expressApp = new ExpressApp()
    private readonly server = http.createServer(this.expressApp.app)
    private readonly socket = io(this.server)

    constructor() {
        this.initSocket()
    }

    private initSocket = () => {
        this.socket.on("connection", sock => {
            console.log('a user connected')
        })
    }

    public start = (port = 5000) => {
        this.server.listen(port, () => console.log(`Server started at ${port}`))
    }
}

export default Server