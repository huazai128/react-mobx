import { CanvasStore as CanvasStoreModel } from './index'

export as namespace ICanvasStore

export interface CanvasStore extends CanvasStoreModel { }

export type ElementType = 'IText' | 'Triangle' | 'Circle' | 'Rect' | 'Line' | 'Image' | 'Arrow' | 'Mask'

export type AttrType = 'fill' | 'stroke' | 'strokeWidth' | 'imgUrl' | 'strokeWidth' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'underline' | 'textAlign' | 'shadow'

export interface AttrModel {
    fill: string,
    stroke: string,
    strokeWidth: number
    fontFamily?: string
    fontSize?: number
    fontWeight?: number | string
    underline?: boolean
    textAlign?: string
    shadow?: string
}