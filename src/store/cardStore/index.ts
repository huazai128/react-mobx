/*
 * @Author: your name
 * @Date: 2020-05-26 22:26:35
 * @LastEditTime: 2020-05-29 10:21:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/store/cardStore/index.ts
 */
import { observable, action, runInAction } from 'mobx'
import { message } from 'antd'
import { StoreExt } from '@utils/reactExt'
import autobind from 'autobind-decorator'
import { CanvasParams, ImgParams, AllParams } from '@interfaces/card.interface'
import CanvasDrew from './canvasDrew'

/**
 * 通话store
 * @export
 * @class CardStore
 * @extends {StoreExt}
 */
@autobind
export class CardStore extends StoreExt {
    private canvasDrew: CanvasDrew
    // 禁止输入
    @observable isdisable: boolean = false
    // 画卡数据
    @observable public canvasParams: Partial<CanvasParams> = {}
    // 绘制当前图片
    @observable public imgParams: Partial<ImgParams> = {}
    // 所有画卡
    @observable public imgParamsList: Array<Partial<ImgParams>> = []

    /**
     * 获取画卡实例对象
     * @param {*} canvas
     * @memberof CardStore
     */
    @action
    public newCanvas(canvas: any) {
        this.canvasDrew = canvas
    }

    /**
     * 监听canvas宽高变化
     * @param {React.ChangeEvent<HTMLInputElement>} e
     * @param {string} type
     * @memberof CardStore
     */
    @action
    public changeCanvas(e: React.ChangeEvent<HTMLInputElement>, type: string) {
        this.canvasParams[type] = e.target.value
    }

    /**
     * 保存画卡数据
     * @memberof CardStore
     */
    @action
    public saveCanvasParams(canvas: HTMLCanvasElement) {
        if (this.canvasParams.canvasHeight && this.canvasParams.canvasWidth) {
            this.isdisable = true
            this.canvasDrew = new CanvasDrew(canvas, this.canvasParams)
        } else {
            message.info('请输入画布的宽高')
        }
    }

    /**
     * 监听绘制图片参数的变化
     * @param {React.ChangeEvent<HTMLInputElement>} e
     * @param {string} type
     * @memberof CardStore
     */
    @action
    public changeImgParams(e: React.ChangeEvent<HTMLInputElement>, type: string) {
        this.imgParams[type] = e.target.value
        this.canvasDrew.changeDrew('drawImg', this.imgParams)
    }

    @action
    public saveDrewImg() {
        console.log('')
    }
}

export default new CardStore()
