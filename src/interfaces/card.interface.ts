/*
 * @Author: your name
 * @Date: 2020-05-21 17:26:52
 * @LastEditTime: 2020-05-26 22:32:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/containers/views/Canvas/Card/interfase.ts
 */

/**
 * 绘制画卡参数
 * @export
 * @interface CanvasParams
 */
export interface CanvasParams {
    // 画卡宽度
    canvasWidth: number
    // 画卡高度
    canvasHeight: number
    // 设置其他参数
    [key: string]: any
}

/**
 * 绘制通用参数
 * @export
 * @interface DrawModule
 */
export interface DrawModule {
    // 图片宽度
    width: number
    // 图片高度
    height: number
    // 距离X轴
    x: number
    // 距离Y轴
    y: number
    // 半径
    r?: number
}

/**
 * 绘制图片参数
 * @export
 * @interface ImgParams
 */
export interface ImgParams extends DrawModule {
    // 图片链接
    imgUrl: string
}

/**
 * 绘制文字
 * @export
 * @interface DrewText
 */
export interface DrewText extends DrawModule {
    // 绘制文字
    txt: string
    // 文字大小
    size: string
    // 文字粗细
    bold: string
    // 文字颜色
    color: string
}

/**
 * 绘制颜色背景
 * @export
 * @interface DrawBg
 */
export interface DrawBg extends DrawModule {
    // 背景颜色
    bgColor: string
}

/**
 * 绘制直线
 * @export
 * @interface DrawLine
 */
export interface DrawLine {
    // 线宽
    lineWidth: number
    // 起始坐标X
    startX: number
    // 起始坐标Y
    startY: number
    // 终点坐标X
    endX: number
    // 终点坐标Y
    endY: number
    // 绘制颜色
    strokeStyle?: string
    // 填充颜色
    fillColor?: string
    // 更多坐标
    [key: string]: any
}

export type AllParams = Partial<ImgParams> | DrewText | DrawBg | DrawLine
