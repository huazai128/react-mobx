/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 15:46:39
 * @LastEditTime: 2019-10-25 14:09:08
 * @LastEditors: Please set LastEditors
 */
import { ArticleStore as ArticleStoreModel } from './index'
import { EPublishState, EPublicState, EOriginState } from '@interfaces/state.interface'

export as namespace IArticleStore

export interface ArticleStore extends ArticleStoreModel {}

export interface IArticle {
    _id: string
    content: string
    title: string
    description: string
    thumb: string
    password: string
    keywords: string[]
    state: EPublishState
    public: EPublicState
    origin: EOriginState
    tags: Array<ITagStore.ITag>
    t_content: string
    meta: {
        likes: number
        views: number
        comments: number
    }
    create_at?: Date
    update_at?: Date
    extends?: any
    related?: IArticle[]
}
