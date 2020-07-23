import Client from "./Client";

export default class ClientStore {
    private readonly _clients: { [username: string]: Client } = Object.create(null)

    public addClient(client: Client): Promise<void> {
        return new Promise((resolve, reject) => {
            const key = client.user.name
            if (this._clients[key] != null) {
                console.log('ClientStore: rejected user', client.user.name)
                reject()
            } else {
                console.log('ClientStore: accepted user', client.user.name)
                this._clients[key] = client
                resolve()
            }
        })
    }

    public removeClient = (client: Client) => {
        delete this._clients[client.user.name]
    }

    public getClient = (username: string): Client | undefined => {
        return this._clients[username]
    }

    public emitUsers = (userNames: string[], evtName: string, ...evtArgs: any[]) => {
        console.log(`ClientStore: sending event`, evtName, `to clients`, userNames)
        for (let userName of userNames) {
            let client = this.getClient(userName)
            client?.socket.emit(evtName, ...evtArgs)
        }
    }

    public emitAll = (evtName: string, ...evtArgs: any[]) => {
        return this.emitUsers(Object.keys(this._clients), evtName, ...evtArgs)
    }
}