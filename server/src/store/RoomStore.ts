import User from "../../../client/src/lib/models/User";
import Room from "../../../client/src/lib/models/Room";
import events from "events";
import {RoomAddedEvt, RoomRemovedEvt} from "../../../client/src/lib/events/RoomEvts";

type RoomType = {
    [user: string]: boolean
}

export default class RoomStore extends events.EventEmitter {
    private readonly _rooms: { [k: string]: RoomType } = {}

    public joinRoom = (room: Room, user: User): Promise<void> => {
        const userName = user.name
        const roomName = room.name
        return new Promise((resolve, reject) => {
            this.addRoom(roomName)
            if (this._rooms[roomName][userName]) {
                reject('already in room')
            } else {
                this.addUser(userName, roomName)
                resolve()
            }
        })
    }

    public getRoom = (roomName: string): RoomType | undefined => {
        return this._rooms[roomName]
    }

    public getUsersInRoom = (roomName: string): string[] => {
        let room = this.getRoom(roomName)
        if (!room) return []
        return Object.keys(room)
    }

    private addUser = (userName: string, roomName: string) => {
        let room = this._rooms[roomName]
        room[userName] = true
        console.log(`RoomStore: added user ${userName} to room ${roomName}`)
    }

    public removeUser = (userName: string) => {
        for (let roomName of Object.keys(this._rooms)) {
            delete this._rooms[roomName][userName]
            console.log(`RoomStore: removed user ${userName} from room ${roomName}`)
            this.removeRoom(roomName)
        }
    }

    private addRoom = (roomName: string) => {
        if (!this._rooms[roomName]) {
            this._rooms[roomName] = {}
            let evt = new RoomAddedEvt(roomName)
            console.log(`RoomStore: added room ${roomName}`)
            this.emit(evt.type(), evt)
        }
    }

    private removeRoom = (roomName: string) => {
        if (Object.getOwnPropertyNames(this._rooms[roomName]).length === 0) {
            console.log(`RoomStore: removing room ${roomName}`)
            delete this._rooms[roomName]
            let evt = new RoomRemovedEvt(roomName)
            this.emit(evt.type(), evt)
        }
    }
}