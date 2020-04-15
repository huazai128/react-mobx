/*
 * @Author: your name
 * @Date: 2020-04-14 18:21:12
 * @LastEditTime: 2020-04-14 18:54:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/containers/views/Canvas/Like/like.worker.ts
 */
import { exposeWorker } from 'react-hooks-worker'

function getGradientColor(percent: number) {
    const canvas = new OffscreenCanvas(100, 1)
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, 'red')
    gradient.addColorStop(1, 'blue')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, ctx.canvas.width, 1)
    const imgd = ctx.getImageData(0, 0, ctx.canvas.width, 1)
    const colors = imgd.data.slice(percent * 4, percent * 4 + 4)
    return {
        value: `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`
    }
}

exposeWorker(getGradientColor)
