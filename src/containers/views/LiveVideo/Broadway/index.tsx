import * as React from 'react'
import PhonePage from '@components/PhonePage'
// import Player from './broadway.min.js'
import './style.less'

/**
 * Broadway 视频解码器， 通过video播放转给canvas播放，Broadway不支持语音。通过其他三方插件的方式处理
 * @returns
 */
function Broadway() {
    const [socket, setSocket] = React.useState(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    React.useEffect(() => {
        const ws = new WebSocket('ws://localhost:9000/pull/test')
        // const player = new Player({
        //     canvas: canvasRef.current
        // })
        ws.binaryType = 'arraybuffer' // 设置连接返回的数据类型为二进制
        ws.onmessage = evt => {
            const data = evt.data
            if (typeof data !== 'string') {
                // player.decode(new Uint8Array(data));
            } else {
                console.log(JSON.parse(data))
            }
        }
    }, [])
    return (
        <div className="broadway-box">
            <div className=""></div>
            <PhonePage className="broadway-live">
                <canvas ref={canvasRef}></canvas>
            </PhonePage>
        </div>
    )
}

export default Broadway
