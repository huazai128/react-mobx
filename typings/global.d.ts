/*
 * @Author: your name
 * @Date: 2020-04-14 16:36:46
 * @LastEditTime: 2020-10-16 19:08:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/typings/global.d.ts
 */
declare interface PlainObject {
    [propName: string]: any
}

declare interface BooleanObject {
    [propName: string]: boolean
}

declare interface StringObject {
    [propName: string]: string
}

declare interface NumberObject {
    [propName: string]: number
}

declare interface Player { }

declare interface Window {
    // 函数重载
    postMessage(message: any, targetOrigin?: string, transfer?: Transferable[]): void

    webkitIndexedDB: any

    mozIndexedDB: any

    msIndexedDB: any
    // Wasm 挂在到Module下
    Module: any;
    // Wasm提供的文件系统
    FS: any;
    // Wasm提供的 IndexDB 
    IDBFS: any;

}
