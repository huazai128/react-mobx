/*
 * @Author: your name
 * @Date: 2020-05-21 17:26:52
 * @LastEditTime: 2021-01-14 18:13:50
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
    // 画卡缩放比例
    sacal?: number 
    // 画卡背景色
    backgroundColor?: string;
    // 前端请求传递这个参数，当前的视图宽/750
    factor?: number;
    // 图片存储参数
    images?: Array<IImage>
}

/**
 * 圆角
 * @export
 * @interface IDrawRadiusRectData
 */
export interface IDrawRadiusRectData {
    // X轴
    x: number;
    // Y轴
    y: number;
    // 宽
    w: number;
    // 高
    h: number;
    // 圆角大小
    r: number;
}

/**
 * 绘制图片
 * @export
 * @interface IImage
 */
export interface IImage {
    // X轴
    x: number;
    // Y轴
    y: number;
    // 图片链接
    imgUrl: string;
    // 宽
    width: number;
    // 高
    height: number;
    // 圆角大小
    borderRadius?: number;
    // 线宽
    borderWidth?: number;
    // 边框线颜色
    borderColor?: string;
    // 绘制颜色
    strokeStyle?: string;
    // 层级
    zIndex?: number;
}

/**
 * 绘制文本
 * @export
 * @interface IText
 */
export interface IText {
    // X轴
    x: number;
    // Y轴
    y: number;
    // 文案
    text: string | Array<string>;
    // 表示当前文案于之前的文案联动(当期文案的所在的位置和上一个文案有关联)
    status?: 'X' | 'Y' | ['X' , 'Y']
    // 表示清除联动
    closeStatue?: 'Y' | 'X' | ['X' , 'Y']
    // 字体大小
    fontSize: number;
    // 字体颜色
    color?: string;
    // 字体透明度
    opacity?: 1 | 0;
    // 字体行高
    lineHeight?: number;
    // 字体限制行数
    lineNum?: number;
    // 字体宽度
    width?: number;
    // 左右字体的间距
    marginLeft?: number;
    // 上下字体间距
    marginTop?: number;
    // 文字是否绘制线
    textDecoration?: 'line-through' | 'none';
    // 文字的竖直对齐方式
    baseLine?: 'top' | 'middle' | 'bottom';
    // 文字样式位置
    textAlign?: 'left' | 'center' | 'right';
    // 字体
    fontFamily?: string;
    // 文字粗细
    fontWeight?: string;
    // 文字样式
    fontStyle?: string;
    // 层级
    zIndex?: number;
}

