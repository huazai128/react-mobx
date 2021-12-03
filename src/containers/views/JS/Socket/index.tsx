import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { Manager } from "socket.io-client";


interface IProps { }

const Socket: React.FC<IProps> = ({ }: IProps) => {
    const socketRef = useRef()
    useEffect(() => {
        const manager = new Manager('http://localhost:3001');
        // const socket = manager.socket('/')
        // socket.io.on('error', () => {
        //     console.log('链接失败')
        // })
        // socket.io.on('connect', () => {
        //     console.log('链接成功')
        //     socket.io.emit('events', { test: 'test' })
        // })
        // socket.on('events', function (data) {
        //     console.log('event', data);
        // });
    }, [])
    return (
        <div>Socket</div>
    )
}

export default observer(Socket)
