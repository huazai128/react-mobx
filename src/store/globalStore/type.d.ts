/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-22 17:40:59
 * @LastEditTime: 2019-04-22 17:40:59
 * @LastEditors: your name
 */
import { GlobalStore as GlobalStoreModel } from './index'

export as namespace IGlobalStore

export interface GlobalStore extends GlobalStoreModel {}

export type SideBarTheme = 'dark' | 'light'

export interface PaginationConf {
    total?: number
    current_page?: number
    totalPage?: number
    per_page?: number
}
