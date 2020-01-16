/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-29 17:48:24
 * @LastEditTime: 2019-11-07 11:32:25
 * @LastEditors: Please set LastEditors
 */
import { observable, action, runInAction } from 'mobx'
import { StoreExt } from '@utils/reactExt'
import { ParmasOptions, CONTROLLER_OPT } from '@interfaces/params.interfaces'

export class SearchStore extends StoreExt {
    @observable options: ParmasOptions = {}
    @observable isControll: boolean = false
    @observable controOpts: CONTROLLER_OPT = CONTROLLER_OPT.NORMAL

    @action
    getSreachObj = (data: ParmasOptions) => {
        if (data.date && !!data.date.length && !data.date[0]) {
            data.date = []
        }
        runInAction('SET_OPTIONS', () => {
            this.options = { ...this.options, ...data }
        })
    }
    @action
    clearSreachObj = () => {
        this.controOpts = CONTROLLER_OPT.NORMAL
        this.options = {}
    }

    @action
    allowControll = (flag: boolean) => {
        this.isControll = flag
    }

    @action
    handleOperat = (opts: CONTROLLER_OPT) => {
        runInAction('OPTION_VALUE', () => {
            this.controOpts = opts
        })
    }
}

export default new SearchStore()
