/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 15:46:26
 * @LastEditTime: 2019-11-07 11:54:01
 * @LastEditors: Please set LastEditors
 */
import { observable, action, runInAction } from 'mobx'
import { ParmasOptions, BatchOptions } from '@interfaces/params.interfaces'
import { StoreExt } from '@utils/reactExt'
import { routerStore } from './../'
import { message } from 'antd'

export class ArticleStore extends StoreExt {
    @observable loading: boolean = false // 加载状态
    @observable articles: Array<IArticleStore.IArticle> = [] // 文章列表
    @observable paginationObj: IGlobalStore.PaginationConf = {} // 分页数据
    @observable articleId: string = '' // 文章id
    @observable article: IArticleStore.IArticle = null // 文章内容

    @action
    saveArticle = async (params: IArticleStore.IArticle) => {
        let res = this.articleId ? this.updateArticle(params) : await this.api.article.addArticle(params)
        if (res) {
            routerStore.replace('/article/list')
        }
    }

    @action
    getArticleList = async (params: ParmasOptions = {}) => {
        if (this.loading) {
            return false
        }
        this.loading = true
        try {
            const { data, pagination } = await this.api.article.getArticles(params)
            runInAction('SET_ARTICLES_LIST', () => {
                this.paginationObj = pagination || {}
                this.articles = data || []
            })
        } catch (error) {}
        runInAction('HIDE_ARTICLES_LOADING', () => {
            this.loading = false
        })
    }

    @action
    getArticleId = async (id: string) => {
        this.articleId = id
        const res = await this.api.article.getArticleId(id)
        runInAction('GET_ARTICLE_ID', () => {
            this.article = res
        })
    }

    updateArticle = async (article: IArticleStore.IArticle): Promise<IArticleStore.IArticle> => {
        const res = await this.api.article.updateArticleId(this.articleId, Object.assign(this.article, article))
        message.info('修改成功')
        return res
    }

    @action
    batchUpdate = async (params: BatchOptions) => {
        const { ok } = await this.api.article.batchUpdate(params)
        if (Object.is(ok, 1)) {
            this.getArticleList()
        }
    }

    @action
    batchDelete = async (params: BatchOptions) => {
        const { ok } = await this.api.article.batchDelete(params)
        if (Object.is(ok, 1)) {
            this.getArticleList()
        }
    }
}

export default new ArticleStore()
