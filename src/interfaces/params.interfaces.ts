/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 15:10:22
 * @LastEditTime: 2019-11-07 11:29:40
 * @LastEditors: Please set LastEditors
 */

export enum CONTROLLER_OPT {
    UPDATE = '1',
    REMOVE = '-2',
    RECYCLE = '-1',
    NORMAL = ''
}

// 分页搜索条件
export interface ParmasOptions {
    page?: number
    per_page?: number
    keyword?: string
    tags?: Array<string>
    date?: Array<string>
}

export interface BatchOptions {
    ids: Array<string>
    state?: CONTROLLER_OPT
}
