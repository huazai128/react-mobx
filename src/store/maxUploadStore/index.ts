/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-16 17:53:18
 * @LastEditTime: 2021-02-07 15:21:41
 * @LastEditors: Please set LastEditors
 */
import { observable, action, runInAction } from 'mobx'
import { StoreExt } from '@utils/reactExt'
import autobind from 'autobind-decorator'
import { message } from 'antd'
import { ChangeEvent } from 'react'

enum Status {
    WAIT = 'WAIT',
    PAUSE =  'PAUSE',
    UPLOADING = 'UPLOADING'
}

export interface FileModel {
    fileHash: string;
    index: number;
    hash: string;
    chunk: string;
    size: number;
    percentage: number;
}

/**
 * 用于大文件上传
 * @export
 * @class MaxUploadStore
 * @extends {StoreExt}
 */
@autobind
export class MaxUploadStore extends StoreExt {
    private zipReg: RegExp = new RegExp(/^.*(?<=(zip|rar|tar))$/);
    private imageReg: RegExp = new RegExp(/^.*(?<=(jpg|jpeg|png))$/);
    private videoReg: RegExp = new RegExp(/^.*(?<=(mp4|avi|rmvb|flv))$/);
    private KB:number = 1024;
    private MB:number = 1024 * this.KB;
    private GB:number = 1024 * this.MB;
    private size: number = 1024 // 切片大小
    // 上传文件信息
    private file: File;
    // 文件hash
    private hash: string;
    // 用于存储等待上传分片文件
    private reqestList: Array<any> = []
    // worker实例
    private worker: Worker = null;
    // 文件分片进度
    @observable percentage: number = 0
    // 已经上传的文件存储
    @observable fileData: Array<FileModel> = []
    // 文件上传状态
    @observable status: Status = Status.WAIT
    
    // 选择上传文件
    @action
    beforeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if(!file) {
            message.info('请上传文件')
            return
        }
        // 重置数据
        this.resetData();
        this.file = file;
        this.calFileInfo();
    }

    /**
     * 验证文件以及获取文件格式
     * @private
     * @memberof MaxUploadStore
     */
    private calFileInfo() {
        const { name, size } = this.file
        // 针对不同文件上传到不同桶，方便管理
        if(this.zipReg.test(name)) {
            console.log('压缩文件')
        } else if(this.imageReg.test(name)) {
            console.log('图片资源')
        } else if(this.videoReg.test(name)) {
            console.log('视频资源')
        } 
    }

    /**
     * 点击开始上传
     * @memberof MaxUploadStore
     */
    @action
    changeFile = async () => {
        // 生成分片文件
        const fileChunkList = this.createFileChunk(this.file)
        // 生成文件hash
        this.hash = await this.calculateHash(fileChunkList)
        // 验证文件是否有上次过
        const { shouldUpload, uploadedList } = await this.verifyUpload(this.file.name, this.hash)
        if (!shouldUpload) {
            message.info('秒传啊,上传成功')
            // 等待上传
            this.status = Status.WAIT
            return 
        }
        // 针对分片文件进行上传前的处理
        this.fileData = fileChunkList.map(({ file }, index) => {
            return {
                fileHash: this.hash,
                index,
                hash: this.hash + "-" + index,
                chunk: file,
                size: file.size,
                percentage: uploadedList.includes(index) ? 100 : 0
            }
        })
        // 上传 并过滤已经上传的片段
        this.uploadChunks(uploadedList)
    }

    /**
     * 重置数据
     * @private
     * @memberof MaxUploadStore
     */
    private resetData() {
        this.reqestList = []
        this.status = Status.WAIT
        if(this.worker) {
            this.worker.onmessage = null;
        }
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
    private calculateHash(fileChunkList: Array<Blob>): Promise<string> {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker', { type: 'module' })
            worker.postMessage({ fileChunkList })
            worker.onmessage = (e: MessageEvent) => {
                const { percentage, hash } = e.data
                this.percentage = percentage
                if (hash) {
                    resolve(hash)
                }
            }
        })
    }

    /**
     * 根据 hash 验证文件是否曾经已经被上传过
     * @private
     * @param {string} filename
     * @param {string} fileHash
     * @returns
     * @memberof MaxUploadStore
     */
    private async verifyUpload(filename: string, fileHash: string) {
        const res = await this.api.upload.verifyUpload({ filename, fileHash })
        return res
    }

    /**
     * 上传文件
     * @private
     * @param {Array<FileModel>} uploadedList
     * @memberof MaxUploadStore
     */
    private async uploadChunks (uploadedList: Array<any> = []) {
        const requestList = []
        this.fileData
            .filter(({ hash }) => !uploadedList.includes(hash)) // 过滤已上传的文件
            .map(({ chunk, hash, index }) => {
                const formData = new FormData()
                formData.append('chunk', chunk)
                formData.append('hash', hash)
                formData.append("filename", this.file.name); // 
                formData.append("fileHash", this.hash); // 当前整个文件hash 
                return {
                    formData, index
                }
            }).forEach(({ formData, index }) => {
                const chunkReqItem = this.api.upload.uploadFileHash(formData, {
                    // 上传进度
                    onUploadProgress: (e) => {
                        console.log(e)
                    }
                })
                requestList.push(chunkReqItem)
            })
        // 全部上传
        await Promise.all(requestList);
        // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时 发起合并请求
        if((uploadedList.length + requestList.length) === this.fileData.length) {
            this.mergeUpload();
        }
    }

    /**
     * 发起文件合并请求
     * @private
     * @memberof MaxUploadStore
     */
    private async mergeUpload() {
        await this.api.upload.mergeUpload({
            fileHash: this.hash,
            filename: this.file.name,
            size: this.size
        })
    }
}

export default new MaxUploadStore()
