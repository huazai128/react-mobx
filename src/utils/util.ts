import { NumberLiteralTypeAnnotation } from "@babel/types";

/*
 * @Author: your name
 * @Date: 2020-04-16 15:37:50
 * @LastEditTime: 2021-05-07 14:30:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/utils/util.ts
 */
export function requestFrame(cb: FrameRequestCallback & number) {
    return (requestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000 / 60)
        })(cb)
}


/**
 * 图片懒加载
 * @export
 * @param {string} url
 * @return {*} 
 */
export function loadImg(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img)
        }
        img.src = url;
    })
}

/**
 * 绘制箭头方法
 * @export
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {number} theta
 * @param {number} headlen
 * @return {*} 
 */
export function drawArrow(fromX: number, fromY: number, toX: number, toY: number, theta: number, headlen: number) {
    theta = typeof theta != "undefined" ? theta : 30;
    headlen = typeof theta != "undefined" ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
    let arrowX = fromX - topX,
        arrowY = fromY - topY;
    let path = " M " + fromX + " " + fromY;
    path += " L " + toX + " " + toY;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += " M " + arrowX + " " + arrowY;
    path += " L " + toX + " " + toY;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += " L " + arrowX + " " + arrowY;
    return path;
}

/**
 * 坐标转换
 * @export
 * @param {number} mouseX
 * @param {number} mouseY
 * @return {*} 
 */
export function transformMouse(mouseX: number, mouseY: number) {
    return { x: mouseX, y: mouseY };
}

/**
 * 下载
 * @export
 * @param {string} url
 * @param {string} filename
 * @param {Function} [cb]
 * @return {*} 
 */
export function download(url: string, filename: string, cb?: Function) {
    // 具体实现方案参考微信公众号《趣谈前端》- iframe跨页通信和前端实现文件下载
    return fetch(url).then(res => res.blob().then(blob => {
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        cb && cb()
    }))
}

/**
 * hex转rgb数组
 * @param hex 
 * @returns 
 */
export const hexToRgba = (hex: string) => {
    const r = parseInt(`0x${hex.slice(1, 3)}`) / 255;
    const g = parseInt(`0x${hex.slice(3, 5)}`) / 255;
    const b = parseInt(`0x${hex.slice(5, 7)}`) / 255;
    return [r, g, b, 1.0];
};



/**
 * 把图片转成ImageData
 * @param {string} src
 * @param {number} [width]
 * @param {number} [height]
 * @return {*} 
 */
export const loadImage = (src: string, width?: number, height?: number) => {
    return new Promise<ImageData>(async (resolve, reject) => {
        const img = await loadImg(src)
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width || img.width;
        canvas.height = height || img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        canvas.remove();
        if (imgData) {
            resolve(imgData)
        } else {
            reject('图片转成ImageData失败')
        }
    })
}





/**
* 本地图片或者Blob转成base64格式图片。 可以提供canvas 渲染或者img
* @param {File} file
*/
export const localImageUrl = (file: File | Blob) => {
    return new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            resolve(reader.result)
        }
    })
}