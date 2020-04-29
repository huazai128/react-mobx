/*
 * @Author: your name
 * @Date: 2020-04-14 18:21:12
 * @LastEditTime: 2020-04-29 14:10:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/containers/views/Canvas/Like/like.worker.ts
 */
import { requestFrame } from '@utils/util'

type Loop<R> = (diffTime: number) => R
interface RenderModel {
    render: (time: number) => boolean | void
    duration: number
    timestamp: number
}

class ThumbsUpAni {
    private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    private width: number
    private height: number
    private listImage: Array<CanvasImageSource>
    public renderList: Array<RenderModel> = []
    private scanning: boolean = false
    // 放大时间
    private scaleTime: number = 0.1
    constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
        this.loadImage()
        this.ctx = canvas.getContext('2d')
        this.width = canvas.width
        this.height = canvas.height
    }
    // 初始化图片
    private loadImage() {
        const imgs = [
            'https://img.qlchat.com/qlLive/activity/image/5CAU65L6-OQ69-NQPF-1586948149307-8UQ7KWPFM31O.png',
            'https://img.qlchat.com/qlLive/activity/image/42X5BA7B-TVET-G6WN-1586948154513-I19M2Y723U7P.png',
            'https://img.qlchat.com/qlLive/activity/image/61GHY4BP-PZQZ-V8WP-1586948159404-AGL1I2OT571F.png',
            'https://img.qlchat.com/qlLive/activity/image/36WBA8ZN-26PK-RF72-1586948164293-61CYDBCW4U9X.png',
            'https://img.qlchat.com/qlLive/activity/image/8E8HLOV3-3MUF-MT76-1586948168892-Y9WULXVROT24.png',
            'https://img.qlchat.com/qlLive/activity/image/8XFOQBCX-7NQQ-PFLA-1586948173302-ONRGPAAZN52O.png'
        ]
        const promiseAll: Array<Promise<any>> = []
        imgs.forEach((img: string) => {
            const p = new Promise((resolve, reject) => {
                // 用于处理图片数据，用于离屏画图
                return fetch(img)
                    .then(response => response.blob())
                    .then(blob => resolve(createImageBitmap(blob)))
            })
            promiseAll.push(p)
        })
        // 这里处理有点慢
        Promise.all(promiseAll)
            .then(lists => {
                console.log(lists, '======listImage')
                this.listImage = lists.filter((img: ImageData) => img && img.width > 0)
            })
            .catch(err => {
                console.error('图片加载失败...', err)
            })
    }
    // 获取指定区域的随机数
    private getRandom(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min + 1))
    }

    // 绘制
    private createRender(): Loop<boolean | void> {
        if (!this.listImage.length) return null
        // 一下是在创建时，初始化默认值
        const context = this.ctx
        // 随机取出scale值
        const basicScale = [0.6, 0.9, 1.2][this.getRandom(0, 2)]
        //随机取一张图片
        const img = this.listImage[this.getRandom(0, this.listImage.length - 1)]
        const offset = 20
        // 随机动画X轴的位置，是动画不重叠在一起
        const basicX = this.width / 2 + this.getRandom(-offset, offset)
        const angle = this.getRandom(2, 12)
        // x轴偏移量10 - 30
        let ratio = this.getRandom(10, 30) * (this.getRandom(0, 1) ? 1 : -1)
        // 获取X轴值
        const getTranslateX = (diffTime: number): number => {
            if (diffTime < this.scaleTime) {
                return basicX
            } else {
                return basicX + ratio * Math.sin(angle * (diffTime - this.scaleTime))
            }
        }
        // 获取Y轴值
        const getTranslateY = (diffTime: number): number => {
            return Number(img.height) / 2 + (this.height - Number(img.height) / 2) * (1 - diffTime)
        }
        // scale方法倍数 针对一个鲜花创建一个scale值
        const getScale = (diffTime: number): number => {
            if (diffTime < this.scaleTime) {
                return Number((diffTime / this.scaleTime).toFixed(2)) * basicScale
            } else {
                return basicScale
            }
        }
        // 随机开始淡出时间,
        const fadeOutStage = this.getRandom(16, 20) / 100
        // 透明度
        const getAlpha = (diffTime: number): number => {
            const left = 1 - diffTime
            if (left > fadeOutStage) {
                return 1
            } else {
                return 1 - Number(((fadeOutStage - left) / fadeOutStage).toFixed(2))
            }
        }
        return diffTime => {
            if (diffTime >= 1) return true
            const scale = getScale(diffTime)
            context.save()
            context.beginPath()
            context.translate(getTranslateX(diffTime), getTranslateY(diffTime))
            context.scale(scale, scale)
            context.globalAlpha = getAlpha(diffTime)
            context.drawImage(img, -img.width / 2, -img.height / 2, Number(img.width), Number(img.height))
            context.restore()
        }
    }
    // 扫描渲染列表
    private scan() {
        // 清屏（清除上一次绘制内容）
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.ctx.fillStyle = '#fff'
        this.ctx.fillRect(0, 0, 180, 400)
        let index = 0
        let len = this.renderList.length
        if (len > 0) {
            // 重新扫描后index= 0；重新获取长度
            requestFrame(this.scan.bind(this))
            this.scanning = true
        } else {
            this.scanning = false
        }
        while (index < len) {
            const curRender = this.renderList[index]
            if (!curRender || !curRender.render || curRender.render.call(null, (Date.now() - curRender.timestamp) / curRender.duration)) {
                // 动画已结束，删除绘制
                this.renderList.splice(index, 1)
                len--
            } else {
                index++
            }
        }
    }
    // 点赞开始
    public likeStart() {
        // 初始化礼物数据、回调函数
        const render = this.createRender()
        const duration = this.getRandom(1500, 3000)
        this.renderList.push({
            render,
            duration,
            timestamp: Date.now()
        })
        if (!this.scanning) {
            this.scanning = true
            requestFrame(this.scan.bind(this))
        }
        return this
    }
}
let thumbsUpAni
// console.log(self) // 除了不能操作dome以外indexDB都能操作, postMessage不能传递函数这些东东
self.addEventListener('message', ({ data }) => {
    if (data.canvas) {
        const canvas = data.canvas
        console.log(1212)
        thumbsUpAni = new ThumbsUpAni(canvas)
    } else {
        thumbsUpAni.likeStart(data.num)
        // self.postMessage({ // 不传递函数
        //     name: () => {
        //         console.log(23232)
        //     }
        // })
    }
})
