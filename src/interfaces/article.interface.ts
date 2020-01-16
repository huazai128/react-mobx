/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-05 11:28:17
 * @LastEditTime: 2019-10-05 11:43:21
 * @LastEditors: Please set LastEditors
 */

// 元数据
export interface IMeta {
    likes: number
    views: number
    comments: number
}

export interface IArticle {
    title: string
    content: string
    description: string
    thumb: string
    password?: string
    keywords?: string[]
    state: number,
    public: number,
    origin: number
    tags?: any[]
    meta?: IMeta
    create_at?: Date
    update_at?: Date
    extends?: any[]
    related?: IArticle[]
}
