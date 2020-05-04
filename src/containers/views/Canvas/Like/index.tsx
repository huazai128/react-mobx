import React, { useRef, useEffect, useState, useCallback } from 'react'
import { requestFrame } from '@utils/util'
import * as styles from './style.scss'

interface LinkProps {}
type Loop<T, R> = (diffTime: T) => R
let thumbsInter: any = null

/**
 * canvas点赞效果
 * @returns
 */
const Link: React.FC<LinkProps> = ({  }: LinkProps) => {
    const canvasNode = useRef<HTMLCanvasElement>(null)
    const [cavasAni, setCavasAni] = useState<ThumbsUpAni>(null)
    // 默认结尾值为0
    const [praiseLast, setPraiseLast] = useState<number>(0)
    const [thumbsStart, setTumbsStart] = useState<number>(0)
    const [newWorker, setNewWorker] = useState<Worker>(null)
    useEffect(() => {
        // init()
    }, [])
    const init = async () => {
        const worker = new Worker('./like.worker', { type: 'module' })
        // offscreenCanvas离屏画卡很多浏览器不兼容, offscreenCanvas可以在window下可以使用也可以在web worker下使用， canvas只能在window下使用
        if ('OffscreenCanvas' in window) {
            const offscreenCanvas = canvasNode.current.transferControlToOffscreen()
            worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas as OffscreenCanvas])
            setNewWorker(worker)
        } else {
            const thumbsUpAni = new ThumbsUpAni(canvasNode.current)
            setCavasAni(thumbsUpAni)
        }
        worker.addEventListener('error', error => {
            console.log(error)
        })
    }
    const postLike = useCallback(() => {
        if ('OffscreenCanvas' in window) {
            newWorker.postMessage({ num: 10 })
        } else {
            thumbsUp(10)
        }
    }, [cavasAni, praiseLast, newWorker])
    // 处理大量数据绘制重叠问题
    const thumbsUp = (num: number) => {
        // 添加的数据数据小于阈值 则返回
        if (num <= praiseLast) return false
        let curThumbsStart = praiseLast
        let curPraiseLast = num
        if (curThumbsStart + 500 < num) {
            curThumbsStart = num - 500
        }
        // 最后渲染值
        setTumbsStart(praiseLast)
        setPraiseLast(num)
        const diff = curPraiseLast - curThumbsStart
        let time = 100
        let isFirst = true
        if (!!thumbsInter) return false
        thumbsInter = setInterval(() => {
            if (curThumbsStart >= curPraiseLast) {
                clearInterval(thumbsInter)
                thumbsInter = null
                setTumbsStart(0)
                setPraiseLast(0)
                return false
            }
            curThumbsStart++
            cavasAni.likeStart()
            if (isFirst) {
                isFirst = false
                time = Math.round(5000 / diff)
            }
        }, time)
    }
    return (
        <div>
            <h3>Canvas点赞动效</h3>
            <div className={styles['like-box']}>
                <canvas ref={canvasNode} width="180" height="400"></canvas>
                <p onClick={postLike}>&#xe600;</p>
            </div>
        </div>
    )
}

interface RenderModel {
    render: (time: number) => boolean | void
    duration: number
    timestamp: number
}

/**
 * 正常写法点赞动效
 * @class ThumbsUpAni
 */
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
                const image = new Image()
                image.src = img
                image.crossOrigin = 'Anonymous'
                image.onerror = image.onload = resolve.bind(null, image)
            })
            promiseAll.push(p)
        })
        Promise.all(promiseAll)
            .then(lists => {
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
    private createRender(): Loop<number, boolean | void> {
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

export default Link
