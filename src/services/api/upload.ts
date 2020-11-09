/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 14:21:29
 * @LastEditTime: 2020-11-02 11:21:23
 * @LastEditors: Please set LastEditors
 */

import http from '@services/http'

export default {
    // 新增文章
    getQiniuToken(): Promise<any> {
        return http.post('expansion/uptoken', {})
    },

    // 验证是否上传
    verifyUpload(data = {}): Promise<any> {
        return http.get('upload/verify', data)
    },
    
    // 上传文件
    uploadFileHash(data={},config = {}): Promise<any> {
        return http.post('upload/fileChunk',data, config)
    }
}
