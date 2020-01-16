/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 14:41:28
 * @LastEditTime: 2019-10-08 18:18:03
 * @LastEditors: Please set LastEditors
 */

export interface IData {
    token?: string
    key?: string
}

export interface IUploadState {
    name?: string
    uploadUrl?: string
    data?: IData
    thumb?: string
    beforeUpload?: (file: any) => any
    changeFile?: (file: any) => void
    getToken?: () => void
    uploadFn?: (param: any) => any
}
