import { fabric, } from 'fabric'
import { nanoid } from 'nanoid';

interface BaseConfig {
    left: number
    top: number
}

type ImageConfig = BaseConfig & {
    scale: number
}

const baseShapeConfig = {
    IText: {
        text: 'Holle World',
        width: 60,
        height: 60,
        fill: '#06c'
    },
    Image: {},
}

export class CanvasDraw {
    canvas: fabric.Canvas;

    constructor(id: string) {
        this.canvas = new fabric.Canvas(id);
    }

    /**
     * 绘制图片
     * @param {string} url
     * @memberof CanvasDraw
     */
    drawImage(url: string, { scale = 0.345, top = 0, left = 0 }: ImageConfig) {
        fabric.Image.fromURL(url, function (oImg: any) {
            oImg.scale(scale).set({
                left,
                top,
            });
            oImg.set('selectable', false); // 禁止拖动
            this.canvas.add(oImg);
        });
    }

    /**
     * 绘制文字
     * @param {BaseConfig} { left = 0, top = 0 }
     * @memberof CanvasDraw
     */
    drawText({ left = 0, top = 0 }: BaseConfig) {
        const txt = new fabric.IText(nanoid(8), {
            ...baseShapeConfig['IText'],
            left,
            top,
        })
        this.canvas.add(txt)
    }

}
