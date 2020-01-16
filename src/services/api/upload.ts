/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 14:21:29
 * @LastEditTime: 2019-10-03 16:04:34
 * @LastEditors: Please set LastEditors
 */

import http from '@services/http'

export default {

    // 新增文章
    getQiniuToken(): Promise<any> {
        return http.post('expansion/uptoken', {})
    },

}
