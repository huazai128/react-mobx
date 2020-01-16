/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-03 22:30:32
 * @LastEditTime: 2019-08-28 18:04:23
 * @LastEditors: Please set LastEditors
 */
import { TagStore as TagStoreModel } from './index'

export as namespace ITagStore

export interface TagStore extends TagStoreModel {}

export interface TagParams {
    name: string
}

export interface ITag {
    _id: string
    name: string
    slug: string
    description: string
    type: number
    enable: boolean
    create_at: Date
}
