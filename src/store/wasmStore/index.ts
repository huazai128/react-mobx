import { observable, action, computed } from 'mobx'
import { StoreExt } from '@utils/reactExt'
import autobind from 'autobind-decorator'
import { pList } from './data'


@autobind
export class WasmStore extends StoreExt {

    // 当前设置对象ID
    @observable curDisignId: string | number = 2

    // 所有设计器场景数据
    @observable pList: Array<any> = pList

    // 当前设计器场景详情
    @computed
    get curDisignInfo() {
        return this.pList.find((item) => item.id == this.curDisignId);
    }

    /**
     * 切换衣服场景
     * @param {string} id
     * @memberof WasmStore
     */
    @action
    tabChangeHandle(id: string) {
        this.curDisignId = id;
    }
}


export default new WasmStore()