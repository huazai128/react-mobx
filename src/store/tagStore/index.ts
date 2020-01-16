/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-03 22:30:11
 * @LastEditTime: 2019-10-30 11:57:09
 * @LastEditors: Please set LastEditors
 */
import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'
import { StoreExt } from '@utils/reactExt'
import { ParmasOptions } from '@interfaces/params.interfaces'
import { message } from 'antd'

export class TagStore extends StoreExt {
    isFlag = false // 防止多次点击
    @observable page = 1 // 分页数
    @observable size = 50 // 每页请求数
    @observable loading = false // 加载状态
    @observable tags: Array<ITagStore.ITag | any> = [] // 标签列表
    @observable paginationObj: IGlobalStore.PaginationConf = {} // 分页数据

    @action
    addTag = async (value: ITagStore.TagParams) => {
        if (this.isFlag) {
            return false
        }
        this.isFlag = true
        try {
            await this.api.tag.addTag(value)
            this.getTagList()
            message.success('新增标签成功')
        } catch (error) {}
        this.isFlag = false
    }

    @action
    getTagList = async (params: ParmasOptions = {}) => {
        if (this.loading) {
            return false
        }
        this.loading = true
        if (!params.page) {
            params.page = 1
        }
        if (!params.per_page) {
            params.per_page = this.size
        }
        try {
            const { data, pagination } = await this.api.tag.getTagList(params)
            runInAction('SET_TAG_LIST', () => {
                this.paginationObj = pagination || {}
                this.tags = data || []
            })
        } catch (error) {}
        runInAction('HIDE_TAG_LOADING', () => {
            this.loading = false
        })
    }

    changePageSize = (pageSize: number) => {
        this.size = pageSize
        this.getTagList({ per_page: pageSize })
    }

    changePageIndex = (current: number) => {
        this.page = current
        this.getTagList({ page: current })
    }

    @action
    changePagination = (pagination: PaginationConfig) => {
        const { current, pageSize } = pagination
        if (current !== this.page) {
            this.changePageIndex(current)
        }
        if (pageSize !== this.size) {
            this.changePageSize(pageSize)
        }
    }

    @action
    batchDelete = async (ids: string[] = []) => {
        await this.api.tag.batchDeletaTags(ids)
        this.getTagList()
        message.success('批量删除标签成功')
    }
    @action
    deleteTagId = async (id: string) => {
        await this.api.tag.deleteTagId(id)
        this.getTagList()
        message.success('删除标签成功')
    }
}

export default new TagStore()
