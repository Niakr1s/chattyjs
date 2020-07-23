import React from "react";
import io from 'socket.io-client'
import User from "../lib/models/User";
import Room from "../lib/models/Room";
import Text from "../lib/models/Text";
import EmitResult from "../lib/socket/EmitResult";
import ClientMessage from "../lib/events/ClientMessage";
import JoinEvt from "../lib/events/JoinEvt";
import LoginEvt from "../lib/events/LoginEvt";
import ServerMessage from "../lib/events/ServerMessage";

type IState = {
    messages: ServerMessage[],
    error: string,
    user: User,
}

class Temp extends React.Component<any, IState> {
    private socket: SocketIOClient.Socket;
    private readonly room: Room;
    private readonly messageRef: React.RefObject<HTMLInputElement> = React.createRef()
    private readonly usernameRef: React.RefObject<HTMLInputElement> = React.createRef()

    constructor(props: any) {
        super(props);
        this.state = {
            messages: [],
            error: '',
            user: new User(''),
        }
        this.room = new Room('Main')
        this.socket = io()
    }

    login = () => {
        this.socket.emit('connect')
            .emit(LoginEvt.eventName, new LoginEvt(this.state.user))
            .emit(JoinEvt.eventName, new JoinEvt(this.room), (emitResult: EmitResult) => {
                if (emitResult.error) this.handleError(emitResult.cause)
            })
    }

    addMessage = (messageEvent: ServerMessage) => {
        console.log('got', messageEvent)
        this.setState(oldState => ({messages: [...oldState.messages, messageEvent]}))
    }

    handleError = (error: string) => {
        {this.setState({error})}
    }

    sendMessage = (message: Text) => {
        const messageEvent = new ClientMessage(message, this.room, this.state.user)
        this.socket.emit(ClientMessage.eventName, messageEvent, (emitResult: EmitResult) => {
            if (emitResult.error) {this.handleError(emitResult.cause)}// else {this.handleMessageEvent(messageEvent)}
        })
    }

    onSendMessageClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const current = this.messageRef.current
        if (!current) return
        const text = current.value
        current.value = ''
        if (!text) return
        const message = new Text(text)
        this.sendMessage(message)
    }

    resetSocket = () => {
        this.socket.removeAllListeners()
        this.socket.disconnect()
        this.socket = io()
    }

    socketInit = (user: User) => {
        this.socket.emit('connect')
            .emit(LoginEvt.eventName, new LoginEvt(user))
            .emit(JoinEvt.eventName, new JoinEvt(this.room), (emitResult: EmitResult) => {
                if (emitResult.error) this.handleError(emitResult.cause)
            })
        this.socket.on(ServerMessage.eventName, (serverMessage: ServerMessage) => {
            this.addMessage(serverMessage)
        })
        this.socket.on('disconnect', () => {
            this.handleError('disconnected')
        })
    }

    onConnectClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const current = this.usernameRef.current
        if (!current) return
        const user = new User(current.value)
        this.setState({user})
        this.handleError('')

        this.resetSocket()
        this.socketInit(user)
    }

    render() {
        return <div>
            {this.state.messages.map((message, index) => (
                <div key={index}>{`${message.user.name}: ${message.room.name}: ${message.text.text}: ${message.messageInfo.date}`}</div>
            ))}
            <input ref={this.usernameRef}/>
            <button onClick={this.onConnectClick}>Connect</button>
            <input ref={this.messageRef}/>
            <button onClick={this.onSendMessageClick}>Send message</button>
            <div style={{color: "red"}}>{this.state.error}</div>
        </div>
    }
}

export default Temp