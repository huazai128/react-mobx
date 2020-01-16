/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-03 22:12:35
 * @LastEditTime: 2019-10-06 22:08:11
 * @LastEditors: Please set LastEditors
 */
import http from '@services/http'
import { ParmasOptions } from '@interfaces/params.interfaces'

export default {
    // 新增标签
    addTag(data): Promise<any> {
        return http.post('tag', data || {})
    },
    // 获取所有标签
    getTagList(data: ParmasOptions): Promise<any> {
        return http.get('tag', data || {})
    },
    // 批量删除
    batchDeletaTags(data: string[]): Promise<any> {
        return http.delete('tag', { ids: data })
    },
    // 单个删除
    deleteTagId(id: string): Promise<any> {
        return http.delete(`tag/${id}`)
    }
}
