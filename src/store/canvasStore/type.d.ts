import { CanvasStore as CanvasStoreModel } from './index'

export as namespace ICanvasStore

export interface CanvasStore extends CanvasStoreModel { }

export type ElementType = 'IText' | 'Triangle' | 'Circle' | 'Rect' | 'Line' | 'Image' | 'Arrow' | 'Mask'

export type AttrType = 'fill' | 'stroke' | 'strokeWidth' | 'imgUrl' | 'strokeWidth' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'underline'