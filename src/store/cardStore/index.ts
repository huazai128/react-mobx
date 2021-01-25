/*
 * @Author: your name
 * @Date: 2020-05-26 22:26:35
 * @LastEditTime: 2021-01-24 12:00:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/store/cardStore/index.ts
 */
import { observable, action, runInAction, toJS } from 'mobx'
import { message } from 'antd'
import { StoreExt } from '@utils/reactExt'
import autobind from 'autobind-decorator'
import { CanvasParams, IImage, IText, IBlock } from '@interfaces/card.interface'
import CanvasDrew from './canvasDrew'

interface ConfigParams {
    type: string
    placeholder: string
    width?: number
    status?: string;
    data?: Array<any>
}

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
    @observable canvasParams: Partial<CanvasParams> = {}
    // 绘制当前图片
    @observable imgParams: Partial<IImage> = {}
    // 绘制当前文字
    @observable textParams: Partial<IImage> = {}
    // 绘制文本框
    @observable blockParams: Partial<IImage> = {}
    // 悬着绘制文本还是
    @observable drawType: string = 'text'
    // 绘制画卡基本数据
    @observable basieList: Array<ConfigParams> = [
        {
            type: 'canvasWidth',
            placeholder: '请输入宽度'
        },
        {
            type: 'canvasHeight',
            placeholder: '请输入高度'
        },
        {
            type: 'sacal',
            placeholder: '倍数'
        },
        {
            type: 'backgroundColor',
            placeholder: '画卡背景色'
        },
    ]
    // 绘制图片基本数据
    @observable imgsList: Array<ConfigParams> = [
        {
            type: 'imgUrl',
            placeholder: '输入图片链接后续增加图片上传功能',
            width: 400
        },
        {
            type: 'width',
            placeholder: '请输入宽度'
        },
        {
            type: 'height',
            placeholder: '请输入高度'
        },
        {
            type: 'x',
            placeholder: 'X轴距离'
        },
        {
            type: 'y',
            placeholder: 'Y轴距离'
        },
        {
            type: 'borderRadius',
            placeholder: '圆角大小'
        },
        {
            type: 'borderWidth',
            placeholder: '边框大小'
        },
        {
            type: 'borderColor',
            placeholder: '边框颜色'
        },
        {
            type: 'strokeStyle',
            placeholder: '绘制颜色'
        },
        {
            type: 'zIndex',
            placeholder: '绘制层级' // 层级越高越后绘制
        },
    ]
    @observable blockList: Array<ConfigParams> = [
        {
            type: 'width',
            placeholder: '请输入宽度'
        },
        {
            type: 'height',
            placeholder: '请输入高度'
        },
        {
            type: 'x',
            placeholder: 'X轴距离'
        },
        {
            type: 'y',
            placeholder: 'Y轴距离'
        },
        {
            type: 'borderRadius',
            placeholder: '圆角大小'
        },
        {
            type: 'borderWidth',
            placeholder: '边框大小'
        },
        {
            type: 'borderColor',
            placeholder: '边框颜色'
        },
        {
            type: 'backgroundColor',
            placeholder: '背景颜色'
        },
        {
            type: 'zIndex',
            placeholder: '绘制层级' // 层级越高越后绘制
        },
    ]
    // 绘制图片基本数据
    @observable textList: Array<ConfigParams> = [
        {
            type: 'text',
            placeholder: '请输入文本',
            width: 400
        },
        {
            type: 'x',
            placeholder: 'X轴距离'
        },
        {
            type: 'y',
            placeholder: 'Y轴距离'
        },
        {
            type: 'fontSize',
            placeholder: '字体大小'
        },
        {
            type: 'color',
            placeholder: '字体颜色'
        },
        {
            type: 'opacity',
            placeholder: '字体透明度'
        },
        {
            type: 'lineHeight',
            placeholder: '字体行高'
        },
        {
            type: 'lineNum',
            placeholder: '字体限制行数'
        },
        {
            type: 'width',
            placeholder: '字体宽度'
        },
        {
            type: 'textDecoration',
            placeholder: '文字是否绘制线',
            status: 'single',
            data: [
                {
                    type: 'line-through',
                    name: '中划线'
                },
                {
                    type: 'none',
                    name: '无中划线'
                },
            ]
        },
        {
            type: 'baseLine',
            placeholder: '文字竖直对齐方向',
            status: 'single',
            data: [
                {
                    type: 'top',
                    name: '顶部对齐'
                },
                {
                    type: 'bottom',
                    name: '底部对齐'
                },
                {
                    type: 'middle',
                    name: '文案中间对齐'
                }
            ]
        },
        {
            type: 'textAlign',
            placeholder: '文字对齐方向',
            status: 'single',
            data: [
                {
                    type: 'left',
                    name: '左对齐'
                },
                {
                    type: 'center',
                    name: '居中'
                },
                {
                    type: 'right',
                    name: '右对齐'
                }
            ]
        },
        {
            type: 'fontFamily',
            placeholder: '字体格式' // 层级越高越后绘制
        },
        {
            type: 'fontWeight',
            placeholder: '文字粗细' // 层级越高越后绘制
        },
        {
            type: 'fontStyle',
            placeholder: '文字样式' // 层级越高越后绘制
        },
        {
            type: 'status',
            placeholder: '是否与上下文本之间的宽高关联',
            status: 'multiple',
            data: [
                {
                    type: 'X',
                    name: '关联X轴'
                },
                {
                    type: 'Y',
                    name: '关联Y轴'
                }
            ]
        },
        {
            type: 'closeStatue',
            placeholder: '是否清除与上下文本之间关联的宽高',
            status: 'multiple',
            data: [
                {
                    type: 'X',
                    name: '关联X轴'
                },
                {
                    type: 'Y',
                    name: '关联Y轴'
                }
            ]
        },
        {
            type: 'marginLeft',
            placeholder: '左右字体的间距'
        },
        {
            type: 'marginTop',
            placeholder: '上下字体间距'
        },
        {
            type: 'zIndex',
            placeholder: '绘制层级' // 层级越高越后绘制
        },
    ]
    // 需要处理的数据
    private numberList = ['x', 'y', 'width', 'fontSize', 'height', 'zIndex', 'fontWeight', 'marginLeft', 'opacity', 'lineHeight', 'marginTop']
    // 所有图片列表
    private imgList: Array<IImage> = []
    // 所有绘制文本
    private txtList: Array<IText> = []
     // 所有绘制文本
     private blocks: Array<IBlock> = []

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
     * 监听数据数据变化
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
    }

    /**
     * 保存图片
     * @memberof CardStore
     */
    @action
    public saveDrewImg() {
        this.canvasDrew.drawImg((this.imgParams as IImage))
        this.imgList.push((this.imgParams as IImage))
        this.imgParams = {}
    }

    /**
     * 绘制当前文本
     * @param {*} e
     * @param {string} type
     * @memberof CardStore
     */
    @action 
    public changeText(e, type: string) {
        let value
        if(e.target) {
            value = e.target.value
        } else {
            value = e
        }
        if(this.numberList.includes(type)) {
            value = Number(value)
        }
        if(Object.is(this.drawType, 'text')) {
            this.textParams[type] = value
        } else {
            this.blockParams[type] = value
        }
    }

    /**
     * 保存
     * @memberof CardStore
     */
    @action
    public saveDrewText() {
        if(Object.is(this.drawType, 'text')) {
            this.canvasDrew.drawText((toJS(this.textParams) as IText))
            this.txtList.push((toJS(this.textParams) as IText))
            this.textParams = {}
        } else {
            this.canvasDrew.drawBlock((toJS(this.blockParams) as IBlock))
            this.blocks.push((toJS(this.blockParams) as IBlock))
            this.blockParams = {}
        }
    }

    @action
    public handleSizeChange(e) {
        const list = [...new Set([...Object.values(this.textParams), ...Object.values(this.blockParams)])]
        if(!list.length) {
            this.drawType = e.target.value
        } else {
            message.info('已经在编辑中，不能更改')
        }
    }
}

export default new CardStore()
