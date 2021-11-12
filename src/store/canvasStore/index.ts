/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2019-10-24 14:34:01
 * @LastEditors: Please set LastEditors
 */
import { observable, action, reaction, runInAction } from 'mobx'
import autobind from 'autobind-decorator'
import { StoreExt } from '@utils/reactExt'
import PubSub from 'pubsub-js'

interface TypeModel {
    type: ICanvasStore.ElementType | null
    url?: string
}

interface AttrModel {
    fill: string,
    stroke: string,
    strokeWidth: number
    fontFamily?: string
    fontSize?: number
    fontWeight?: number | string
    underline?: boolean
}

@autobind
export class CanvasStore extends StoreExt {
    constructor() {
        super()
    }
    @observable typeObj: TypeModel = {
        type: null,
        url: ''
    }

    @observable attrObj: AttrModel = {
        fill: '#0066cc',
        stroke: '',
        strokeWidth: 0,
    }

    @observable type: string = ''
    /**
     * 插入元素
     * @param {ICanvasStore.ElementType} type
     * @memberof CanvasStore
     */
    @action
    insertElement(type: ICanvasStore.ElementType, url?: string) {
        runInAction(() => {
            this.typeObj = {
                type,
                url
            }
            PubSub.publish('addElement', this.typeObj)
        })
    }

    /**
     * 更新属性
     * @param {ICanvasStore.AttrType} type
     * @param {(string | number)} value
     * @memberof CanvasStore
     */
    @action
    updateAttr(type: ICanvasStore.AttrType, value: string | number) {
        this.attrObj = { ...this.attrObj, [type]: value };
        PubSub.publish('updateAttr', this.attrObj)
    }

    /**
     * 初始化属性信息
     * @param {AttrModel} data
     * @memberof CanvasStore
     */
    @action
    initAttr(data: AttrModel) {
        this.attrObj = { ...this.attrObj, ...data }
        PubSub.publish('updateAttr', this.attrObj)
    }

    /**
     *  判断当前操作类型
     * @param {string} type
     * @memberof CanvasStore
     */
    @action
    controllType(type: string) {
        this.type = type
    }
}

export default new CanvasStore()
