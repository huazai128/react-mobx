import * as React from 'react'
import PhonePage from '@components/PhonePage'
import FlvJs from 'flv.js'
import './style.less'
/**
 * RTMP视频直播
 * @returns
 */
const Rtmp: React.FC<any> = () => {
    const [flvPlay, setFlvPlay] = React.useState<FlvJs.Player>(null)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    React.useEffect(() => {
        if (videoRef.current && FlvJs.isSupported()) {
            initData()
        }
    }, [videoRef])
    const initData = () => {
        // 在没有优化下延迟1-3s左右
        const play = FlvJs.createPlayer(
            {
                type: 'flv',
                isLive: true,
                hasAudio: false,
                url: 'ws://localhost:8000/live/test.flv'
            },
            {
                enableStashBuffer: true, // 开启提高直播的实时性
                stashInitialSize: 128
            }
        )
        play.attachMediaElement(videoRef.current)
        setFlvPlay(play)
    }

    const playBtn = React.useCallback(() => {
        flvPlay.load()
        flvPlay.play()
    }, [flvPlay])
    return (
        <div className="ffmpeg-box">
            <div className="ffmpeg-info">
                <h4>ffmpeg推流</h4>
                <p>1、ffmpeg 是音视频开发的必备神器，本文将通过它来捕获摄像头，进行各种转换和处理，最后进行视频流推送。 下面看看怎么用 ffmpeg 进行 RTMP 推流。</p>
                <p>
                    2、视频采集命令： ffmpeg -devices
                    <img src="" alt="" />
                </p>
                <p>3、当前终端所有支持的输入设备: ffmpeg -f avfoundation -list_devices true -i ""</p>
                <p>
                    4、使用 FaceTime HD Camera 这个输入设备来采集视频，并推送 RTMP 流： ffmpeg -f avfoundation -r 30 -i "FaceTime HD Camera" -c:v libx264 -preset superfast -tune zerolatency -an -f flv
                    rtmp://localhost/live/test
                </p>
                <p>5、ffmpeg延迟优化地址： https://blog.csdn.net/fireroll/article/details/51902018</p>
                <p>
                    6、RTMP的缺点：
                    RTMP有个弱点就是累积误差，原因是RTMP基于TCP不会丢包。所以当网络状态差时，服务器会将包缓存起来，导致累积的延迟；待网络状况好了，就一起发给客户端。这个的对策就是，当客户端的缓冲区很大，就断开重连。当然SRS也提供配置。
                </p>
                <p>7、FFmpeg 支持很多直播流格式，但不支持 Web Sockets，解决方案是用 FFmpeg 开一个 HTTP 直播流，再开个 Node 服务转一下。 或者通过node-media-server插件穿件一个服务。</p>
            </div>
            <PhonePage className="flex-1">
                <video ref={videoRef} controls preload="auto" autoPlay loop webkit-playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>
                <button className="play-btn" onClick={playBtn}>
                    播放
                </button>
            </PhonePage>
        </div>
    )
}
export default Rtmp
