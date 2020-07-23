import Client from "./Client";

export default class ClientStore {
    private readonly _clients: { [username: string]: Client } = Object.create(null)

    public addClient(client: Client): Promise<void> {
        return new Promise((resolve, reject) => {
            const key = client.user.name
            if (this._clients[key] != null) {
                console.log('Store.addClient rejected', client.user)
                reject()
            } else {
                console.log('Store.addClient accepted', client.user)
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

    public emitAll = (userNames: string[], evtName: string, ...evtArgs: any[]) => {
        console.log(`ClientStore: sending event`, evtName, `to clients`, userNames)
        for (let userName of userNames) {
            let client = this.getClient(userName)
            client?.socket.emit(evtName, ...evtArgs)
        }
    }
}