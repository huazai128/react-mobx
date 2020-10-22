/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-16 17:53:18
 * @LastEditTime: 2020-10-14 15:59:16
 * @LastEditors: Please set LastEditors
 */
import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import { StoreExt } from '@utils/reactExt'
import { IData } from '@interfaces/upload.interface'
import { message } from 'antd'

export class UploadStore extends StoreExt {
    @observable uploadUrl: string = 'http://upload.qiniup.com'
    @observable domain: string = 'http://pyusaqeuh.bkt.clouddn.com'
    @observable name: string = 'file'
    @observable data: IData = null
    @observable thumb: string = ''

    @action
    beforeUpload = (file: File) => {
        const isPNG = file.type === 'image/png'
        const isJPEG = file.type === 'image/jpeg'
        const isJPG = file.type === 'image/jpg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isPNG && !isJPEG && !isJPG) {
            message.error('上传头像图片只能是 jpg、png、jpeg 格式!')
            return false
        }
        if (!isLt2M) {
            message.error('上传头像图片大小不能超过 2MB!')
            return false
        }
        this.data.key = `upload_${new Date().getTime()}`
    }

    @action
    changeFile = ({ file: { response } }) => {
        runInAction('SET_thumb', () => {
            console.log(response, 'response')
            if (response) {
                this.thumb = `${this.domain}/${response.key}`
                console.log(this.thumb, 'thumb')
            }
        })
    }

    @action
    getToken = async () => {
        const res = await this.api.upload.getQiniuToken()
        runInAction('UP_LOAD', () => {
            this.data = {
                token: res.up_token
            }
        })
    }

    @action
    uploadFn = async (param: any) => {
        const fd = new FormData()
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: event => {
                param.progress((event.loaded / event.total) * 100)
            }
        }
        fd.append('file', param.file)
        fd.append('key', this.data.key)
        fd.append('token', this.data.token)
        axios
            .post(this.uploadUrl, fd, config)
            .then(({ data }) => {
                param.success({
                    url: `${this.domain}/${data.key}`
                })
            })
            .catch(error => {
                param.error({
                    msg: '上传失败'
                })
            })
    }
}

export default new UploadStore()
