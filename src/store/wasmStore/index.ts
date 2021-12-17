import { observable, action, computed } from 'mobx'
import { StoreExt } from '@utils/reactExt'
import autobind from 'autobind-decorator'
import { pList, tempObj } from './data'

interface MakeMap {
    data: Uint8ClampedArray,
    width: number
    height: number
}
@autobind
export class WasmStore extends StoreExt {

    // 当前设置对象ID
    @observable curDisignId: string | number = 2

    // 所有设计器场景数据
    @observable pList: Array<any> = pList

    // 衣服的背景颜色
    @observable bgColor: string = '#FFFFFF';

    // 当前信息
    @observable tmpInfo: any = tempObj

    // 用来存储怡绘制的数据
    @observable makeMap: Map<string, MakeMap> = new Map();

    // 当前设计器场景详情
    @computed
    get curDisignInfo() {
        return this.pList.find((item) => item.id == this.curDisignId);
    }

    /**
     * 切换裁片场景
     * @param {string} id
     * @memberof WasmStore
     */
    @action
    tabChangeHandle(id: string) {
        this.curDisignId = id;
    }

    /**
     * 获取制作完成的裁片
     * @param {string} id
     * @param {ImageData} data
     * @memberof WasmStore
     */
    @action
    handleTmpChange(id: string, data: MakeMap) {
        this.makeMap.set(id, data)
    }
}


export default new WasmStore()