import * as React from 'react'
import PhonePage from '@components/PhonePage'
import Play from 'broadway'
import './style.less'

/**
 * Broadway 视频解码器， 通过video播放转给canvas播放，Broadway不支持语音。通过其他三方插件的方式处理
 * @returns
 */
function Broadway() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    React.useEffect(() => {}, [])
    return (
        <div className="broadway-box">
            <div className=""></div>
            <PhonePage className="">
                <canvas ref={canvasRef}></canvas>
            </PhonePage>
        </div>
    )
}

export default Broadway
