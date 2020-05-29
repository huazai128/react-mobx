/*
 * @Author: your name
 * @Date: 2020-05-28 14:26:23
 * @LastEditTime: 2020-05-28 14:29:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/store/cardStore/canvasDrew.ts
 */
import { CanvasParams, ImgParams, AllParams } from '@interfaces/card.interface'

/**
 * 画卡实例
 * @class CanvasDrew
 */
class CanvasDrew {
    private ctx: CanvasRenderingContext2D
    private width: number
    private height: number
    constructor(canvas: HTMLCanvasElement, parmas: Partial<CanvasParams>) {
        this.width = canvas.width = parmas.canvasWidth
        this.height = canvas.height = parmas.canvasHeight
        this.ctx = canvas.getContext('2d')
    }

    /**
     * 监听传入参数
     * @param {string} type 绘制类型
     * @param {AllParams} params
     * @memberof CanvasDrew
     */
    public async changeDrew(type: string, params: AllParams) {
        this[type](params)
    }

    /**
     * 绘制图片
     * @private
     * @param {ImgParams} parmas
     * @returns
     * @memberof CanvasDrew
     */
    private async drawImg(parmas: ImgParams) {
        const img = await this.loadImage(parmas.imgUrl)
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.drawImage(img, parmas.x, parmas.y, parmas.width, parmas.height)
        this.ctx.restore()
        this.ctx.save()
    }

    /**
     * 图片加载
     * @private
     * @param {string} url
     * @returns
     * @memberof CanvasDrew
     */
    private loadImage(url: any): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'Anonymous'
            img.onload = () => {
                resolve(img)
            }
            img.onerror = () => {
                reject(new Error('That image was not found.:' + url.length))
            }
            img.src = url
        })
    }
}

export default CanvasDrew
