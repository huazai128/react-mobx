/*
 * @Author: your name
 * @Date: 2020-10-14 18:22:22
 * @LastEditTime: 2020-11-03 14:28:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx/src/store/maxUploadStore/worker.ts
 */
import SparkMD5 from 'spark-md5'

// 文件分片
self.addEventListener('message', res => {
    const { fileChunkList } = res.data
    // 计算文件哈希
    const spark = new SparkMD5.ArrayBuffer()
    let percentage = 0
    let count = 0
    const loadNext = (index: number) => {
        // 读取分片内容，以计算文件哈希
        const reader = new FileReader()
        reader.readAsArrayBuffer(fileChunkList[index].file)
        reader.onload = (e: ProgressEvent<FileReader>) => {
            count++
            spark.append(e.target.result)
            if (count === fileChunkList.length) {
                self.postMessage({
                    percentage: 100,
                    hash: spark.end()
                })
            } else {
                percentage += 100 / fileChunkList.length
                self.postMessage({
                    percentage
                })
                loadNext(count)
            }
        }
    }
    loadNext(count)
})
