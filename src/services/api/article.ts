/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-09 18:57:50
 * @LastEditTime: 2019-11-07 11:21:19
 * @LastEditors: Please set LastEditors
 */
import http from '@services/http'

export default {
    // 新增文章
    addArticle(data): Promise<any> {
        return http.post('acticle', data || {})
    },

    // 获取文字列表
    getArticles(data): Promise<any> {
        return http.get('acticle', data || {})
    },

    // 根据文章ID获取文字信息
    getArticleId(id: string): Promise<any> {
        return http.get(`acticle/${id}`, {})
    },

    // 根据ID更新文章
    updateArticleId(id: string, data) {
        return http.put(`acticle/${id}`, data)
    },

    // 批量更改
    batchUpdate(data) {
        return http.patch('acticle', data)
    },

    // 批量删除
    batchDelete(data) {
        return http.delete('acticle', data)
    }
}
