/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2019-10-24 14:34:01
 * @LastEditors: Please set LastEditors
 */
import { observable, action, reaction, runInAction, toJS } from 'mobx'
import autobind from 'autobind-decorator'
import { StoreExt } from '@utils/reactExt'
import PubSub from 'pubsub-js'

interface TypeModel {
    type: ICanvasStore.ElementType | null
    url?: string
}



@autobind
export class CanvasStore extends StoreExt {
    constructor() {
        super()
    }
    // 元素对象
    @observable typeObj: TypeModel = {
        type: null,
        url: ''
    }

    // 属性
    @observable attrObj: ICanvasStore.AttrModel = {
        fill: '#0066cc',
        stroke: '',
        strokeWidth: 0,
    }

    // 当前编辑元素类型
    @observable type: string = ''

    // 存储新增操作步骤
    private saveList: Array<any> = []

    // 存储删除操作步骤
    private deleteList: Array<any> = []

    // 操作的长度
    saveLen: number = 0;
    // 删除的长度
    deleLen: number = 0;
    // 操作的Index的值
    operIndex: number = -1;

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
    updateAttr(type: ICanvasStore.AttrType, value: string | number | boolean) {
        this.attrObj = { ...this.attrObj, [type]: value };
        console.log(toJS(this.attrObj), value)
        PubSub.publish('updateAttr', this.attrObj)
    }

    /**
     * 初始化属性信息
     * @param {ICanvasStore.AttrModel} data
     * @memberof CanvasStore
     */
    @action
    initAttr(data: ICanvasStore.AttrModel) {
        this.attrObj = { ...this.attrObj, ...data }
        // PubSub.publish('updateAttr', this.attrObj)
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

    /**
     * 保存操作数据
     * @param {*} json
     * @memberof CanvasStore
     */
    @action
    operateData(json: any) {
        // 存在删除操作
        if (this.deleLen > 0) {
            this.deleteList.some((item) => {
                this.saveList[item].del = true
            })
            this.saveList = this.saveList.filter(item => !item.del)
            this.deleteList = []
            this.saveList.push(json)
            this.operIndex = this.saveList.length - 1
        } else {
            this.saveList.push(json)
            this.operIndex = this.operIndex + 1
        }
        this.saveLen = this.saveList.length;
        this.deleLen = this.deleteList.length;
    }

    /**
     * 撤回
     * @memberof CanvasStore
     */
    @action
    prevStep() {
        if (this.operIndex > 0) {
            const json = this.saveList[this.operIndex - 1]
            PubSub.publish('renderJson', json)
            if (this.deleteList.includes(this.operIndex - 1)) {
            } else {
                this.deleteList.push(this.operIndex);
                this.operIndex -= 1
            }
        }
        this.saveLen = this.saveList.length;
        this.deleLen = this.deleteList.length;
    }

    /**
     * 恢复
     * @memberof CanvasStore
     */
    @action
    nextStep() {
        // 判断是否存在最新
        if (this.operIndex + 1 >= this.saveList.length) {
            return
        }
        const json = this.saveList[this.operIndex + 1]
        PubSub.publish('renderJson', json)
        if (this.deleteList.includes(this.operIndex + 1)) {
            const index = this.deleteList.indexOf(this.operIndex + 1)
            this.deleteList.splice(index, 1)
        }
        this.operIndex = this.operIndex + 1;
        this.saveLen = this.saveList.length
        this.deleLen = this.deleteList.length
    }
}

export default new CanvasStore()
