import React, { useRef, useEffect } from 'react'
import './display.less'
import { Display } from './display'
import PubSub from 'pubsub-js'
import useRootStore from '@store/useRootStore'

const zipFile = 'https://cdn-cn.printailor.com/websiteStatic/wasm/20211124/wasm_20211124152744.zip?v=1.2.0.1'
const lowUrl = 'https://static-cn.printailor.com/sky/20211206/91ae9cc93e2501c859723d8ddcdcd5df.zip', sourceUrl = ' https://static-cn.printailor.com/sky/20211206/ee33c1c6a141e4412e453c699f8267a5.zip';


const DisplayCanvas: React.FC = () => {
    const displayRef = useRef<Display>()
    const canvasRef = useRef<HTMLCanvasElement>()
    const { curDisignInfo } = useRootStore().wasmStore
    useEffect(() => {
        console.time('========================allLoad')
        const display = new Display(canvasRef.current);
        display.loadZip(zipFile);
        display.loadResource(lowUrl, sourceUrl);
        displayRef.current = display
        PubSub.subscribe("laoded", () => {
            updateWasm();
            display.updateRender(1, 0, 0, { "0:Scale": 0.5 })
            console.timeEnd('========================allLoad')
        })
    }, [])

    const updateWasm = () => {
        const { settingInfo } = curDisignInfo
        const canvas = document.querySelector('#styleCanvas') as HTMLCanvasElement
        const img = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        const data = new Uint8Array(img.data)
        displayRef.current.updateWasm(data, canvas.width, canvas.height, settingInfo, {
            clipIndex: 0,
            effectIndex: 0,
            icon: "",
            seek: 0.8,
            trackIndex: 1
        })
    }
    return (
        <div className="dc-display-box">
            <div className="dc-canvas-box">
                <canvas ref={canvasRef} id="canvas"></canvas>
            </div>
        </div>
    )
}

export default DisplayCanvas