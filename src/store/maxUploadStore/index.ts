/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-16 17:53:18
 * @LastEditTime: 2020-10-16 19:18:51
 * @LastEditors: Please set LastEditors
 */
import { observable, action, runInAction } from 'mobx'
import { StoreExt } from '@utils/reactExt'
import autobind from 'autobind-decorator'
import { message } from 'antd'

@autobind
export class MaxUploadStore extends StoreExt {
    private size: number = 10 * 1024 * 1024 // 切片大小

    // 用户分片文件上传
    @observable uploadOpts = {
        name: 'file',
        multiple: true,
        action: ''
    }
    @observable percentage: number = 0

    // 在上传之前进行文件的分片
    @action
    beforeUpload = async (file: File) => {
        // 生成分片文件
        const fileChunkList = this.createFileChunk(file)
        const hash = await this.calculateHash(fileChunkList)
        console.log(hash, '=======')
        return true
    }

    @action
    changeFile = () => {
        console.log('分片')
    }
    /**
     * 生成文件切片
     * @private
     * @param {File} file
     * @returns
     * @memberof MaxUploadStore
     */
    private createFileChunk(file: File) {
        const fileChunkList = []
        let cur = 0
        while (cur < file.size) {
            fileChunkList.push({ file: file.slice(cur, cur + this.size) })
            cur += this.size
        }
        return fileChunkList
    }

    /**
     * 生成文件hash
     * @private
     * @param {Array<Blob>} fileChunkList
     * @returns {(Promise<string | number>)}
     * @memberof MaxUploadStore
     */
    private calculateHash(fileChunkList: Array<Blob>): Promise<string | number> {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker', { type: 'module' })
            worker.postMessage({ fileChunkList })
            worker.onmessage = (e: MessageEvent) => {
                const { percentage, hash, name } = e.data
                this.percentage = percentage
                if (hash) {
                    resolve(hash)
                }
            }
        })
    }
}

export default new MaxUploadStore()
