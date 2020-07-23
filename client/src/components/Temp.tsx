import React from "react";
import axios from 'axios'
import io from 'socket.io-client'

class Temp extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            content: '',
        }
    }

    componentDidMount(): void {
        let socket = io()
        socket.emit('data', {message: "hi"})
        axios.get('/api').then(res => {
            console.log(res)
            this.setState({content: res.data})
        })
    }

    render(): React.ReactNode {
        return <div>{this.state.content}</div>
    }
}

export default Temp