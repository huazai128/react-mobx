/*
 * @Author: your name
 * @Date: 2020-05-28 14:26:23
 * @LastEditTime: 2021-01-22 18:11:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/store/cardStore/canvasDrew.ts
 */
import { CanvasParams, IImage, IDrawRadiusRectData, IText, IBlock } from '@interfaces/card.interface'

/**
 * 画卡实例
 * @class CanvasDrew
 */
class CanvasDrew {
    private ctx: CanvasRenderingContext2D
    private width: number
    private height: number
    // 转化因子
    private factor: number
    // 累加计算X轴
    private upX: number = 0
    // 累加计算Y轴
    private upY: number = 0
    // 缩放比例
    private scale: number = 1
    constructor(canvas: HTMLCanvasElement, parmas: Partial<CanvasParams>) {
        this.width = canvas.width = parmas.canvasWidth
        this.height = canvas.height = parmas.canvasHeight
        this.ctx = canvas.getContext('2d');
        this.factor = 1; // 需要从接口传递这个参数 ()
        this.scale = parmas.sacal || 1
        if(parmas.backgroundColor) {
            this.initCardBg(parmas.backgroundColor)
        }
    }
    
    /**
     * 缩放比例
     * @private
     * @memberof CanvasDrew
     */
    private toScale(int: number) {
        return int * this.factor * this.scale
    }
    

    /**
     * 初始化画卡背景
     * @private
     * @param {string} bgColor
     * @memberof CanvasDrew
     */
    private initCardBg(bgColor: string) {
        this.ctx.save();
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.restore();
    }

    /**
     * 绘制图片
     * @public
     * @param {ImgParams} parmas
     * @returns
     * @memberof CanvasDrew
     */
    public async drawImg(parmas: IImage) {
        const { x, y, imgUrl, width, height, borderRadius = 0, borderWidth = 0, borderColor = '#fff', strokeStyle = '#fff' } = parmas
        const img = await this.loadImage(imgUrl)
        this.ctx.save()
        // 绘制圆角
        if(borderRadius > 0) {
            const drawData = {
                x, y, 
                w: width, 
                h: height,
                r: borderRadius
            }
            this.drawRadiusRect(drawData)
            this.ctx.strokeStyle = strokeStyle
            this.ctx.stroke(); // 绘制
            this.ctx.clip(); // 裁剪
            this.ctx.drawImage(img, this.toScale(x), this.toScale(y), this.toScale(width), this.toScale(height));
            if(borderWidth > 0) {
                borderColor && (this.ctx.strokeStyle = borderColor)
                this.ctx.lineWidth = borderWidth
                this.ctx.stroke();
            }
        } else {
            this.ctx.drawImage(img, this.toScale(x), this.toScale(y), this.toScale(width),this.toScale(height))
        }
        this.ctx.restore()
    }

    /**
     * 绘制带有圆角的矩形
     * @private
     * @param {IDrawRadiusRectData} data
     * @memberof CanvasDrew
     */
    private drawRadiusRect(data: IDrawRadiusRectData) {
        const { x, y, w, h, r } = data;
        const br = r / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.toScale(x + br), this.toScale(y));    // 移动到左上角的点
        this.ctx.lineTo(this.toScale(x + w - br), this.toScale(y));
        this.ctx.arc(this.toScale(x + w - br), this.toScale(y + br), this.toScale(br), 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4))
        this.ctx.lineTo(this.toScale(x + w), this.toScale(y + h - br));
        this.ctx.arc(this.toScale(x + w - br), this.toScale(y + h - br), this.toScale(br), 0, 2 * Math.PI * (1 / 4))
        this.ctx.lineTo(this.toScale(x + br), this.toScale(y + h));
        this.ctx.arc(this.toScale(x + br), this.toScale(y + h - br), this.toScale(br), 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4))
        this.ctx.lineTo(this.toScale(x), this.toScale(y + br));
        this.ctx.arc(this.toScale(x + br), this.toScale(y + br), this.toScale(br), 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4))
    }

    /**
     *  绘制文本
     * @param {IText} drawData
     * @memberof CanvasDrew
     */
    public drawText(drawData: IText) {
        const { text } = drawData
        if(Array.isArray(text)) {
            // 暂时不考虑数组
        } else {
            this._drawSingleText(drawData)
        }
    }

    /**
     * 绘制单行或者多行文本
     * @private
     * @param {IText} drawData
     * @memberof CanvasDrew
     */
    private _drawSingleText(drawData: IText) {
        let { x = 0, y = 0, fontSize = 12, color, baseLine, textAlign = 'left', text, opacity = 1, textDecoration = 'none', status = '', closeStatue= 'N',
        width, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = '"苹方 常规","微软雅黑"', marginLeft = 0, marginTop = 0  } = drawData;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.font = fontStyle + " " + fontWeight + " " + this.toScale(fontSize) + "px " + fontFamily
        this.ctx.globalAlpha = opacity
        color && (this.ctx.fillStyle = color)
        baseLine && (this.ctx.textBaseline = baseLine) // 文案线
        this.ctx.textAlign = textAlign // 显示位置
        let textWidth = this.ctx.measureText((text as string)).width;
        const textArr: string[] = [];
        let textH: number = 0
        let drawWidth = this.toScale(width);
        let upX = 0, upY = 0;
        if(status) {
            if(Object.is(status, 'X') || (Array.isArray(status) && status.includes('X'))) {
                upX = this.upX
            }
            if(Object.is(status, 'Y') || (Array.isArray(status) && status.includes('Y'))) {
                upY = this.upY
            }
        }
        let newX = x + upX + marginLeft;
        let newY = y + upY + marginTop;
        // 文字宽度存在并且文字宽度大于设置宽度
        if(width &&  textWidth > drawWidth) {
            let fillText = ''; // 设置填充文字
            let line = 1;
            // 遍历文字
            for (let i = 0; i <= (text as string).length - 1; i++) {
                fillText = fillText + text[i];
                // 判断文字宽度是否大于设置宽度
                if ((this.ctx.measureText(fillText).width) >= drawWidth) {
                    // 超过限制行数
                    if (line === lineNum) {
                        if (i !== (text as string).length - 1) {
                            fillText = fillText.substring(0, fillText.length - 1) + '...';
                        }
                    }
                    // 小于限制行数
                    if (line <= lineNum) {
                        textArr.push(fillText);
                    }
                    fillText = '';
                    line++;
                } else {
                    if (line <= lineNum) {
                        if (i === (text as string).length - 1) {
                            textArr.push(fillText);
                        }
                    }
                }
            }
            textWidth = width;
        } else {
            textArr.push((text as string));
        }
        textArr.forEach((item, index) => {
            textH += ((lineHeight || fontSize) * index)
            // 绘制文字 连通
            this.ctx.fillText(item, this.toScale(newX), this.toScale(newY + textH));
        })
        this.ctx.restore();
        // 绘制文字线
        if(!Object.is(textDecoration, 'none')) {
            let lineY = newY;
            if (textDecoration === 'line-through') {
                // 目前只支持贯穿线
                lineY = newY;
                // 小程序画布baseLine偏移阈值
                let threshold = 5;

                // 根据baseLine的不同对贯穿线的Y坐标做相应调整
                switch (baseLine) {
                    case 'top':
                        lineY += fontSize / 2 + threshold;
                        break;
                    case 'middle':
                        break;
                    case 'bottom':
                        lineY -= fontSize / 2 + threshold;
                        break;
                    default:
                        lineY -= fontSize / 2 - threshold;
                        break;
                }
            }
            this.ctx.save();
            this.ctx.moveTo(this.toScale(newX), this.toScale(lineY));
            this.ctx.lineTo(this.toScale(newX) + this.toScale(textWidth), this.toScale(lineY));
            color && (this.ctx.strokeStyle = color); // 绘制颜色
            this.ctx.stroke();
            this.ctx.restore();
        }
        // 是否和上一个文字距离关联
        if(status) {
            if(Object.is(status, 'X') || (Array.isArray(status) && status.includes('X'))) {
                this.upX += textWidth + marginLeft
            }
            if(Object.is(status, 'Y') || (Array.isArray(status) && status.includes('Y') && !status.includes('X'))) {
                textH = (lineHeight || fontSize) * textArr.length
                this.upY += textH + marginTop
                console.log(this.upY)
            }
        }
        this.clear(closeStatue)
    }

    /**
     * 绘制文本框、 边框、背景、文本对齐等效果
     * @public
     * @param {IBlock} drawData
     * @memberof DrawComponent
     */
    public drawBlock(drawData: IBlock) {
        const { text, typeBorder = 'once', y, x, status, marginRight = 0} = drawData;
        let txt = (text && text.text) || ''
        const newY = Object.is(status, 'Y') ? (this.upY + y) : y
        let newX = x;
        if(Object.is(typeBorder, 'multiple') && Array.isArray(txt)) {
            txt.forEach((item) => {
                newX += this._drawBlock(Object.assign(drawData, { y: newY, x: newX }), item)
                newX += marginRight
            })
        } else {
            this._drawBlock(Object.assign(drawData, { y: newY, }), (txt as string))
        }
    }

    /**
     * 绘制块
     * @private
     * @param {string} text
     * @param {IBlock} drawData
     * @memberof DrawComponent
     */
    private _drawBlock(drawData: IBlock, txt?: string ){
        const { text, width = 0, height, x, y, borderWidth, backgroundColor, borderColor, borderRadius = 0, opacity = 1, padding = 0 } = drawData;
        let blockWidth, textY, textX = 0
        if (typeof txt !== 'undefined' && text) {
            // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
            this.ctx.font = text.fontStyle + " " + text.fontWeight + " " + this.toScale(text.fontSize) + "px " + text.fontFamily
            const textWidth: number = this._getTextWidth(txt, text.fontSize);
            blockWidth = textWidth > width ? textWidth : width;
            blockWidth += 2 * padding;
            const { textAlign = 'left', } = text;
            textY = height / 2 + y; // 文字的y轴坐标在块中线
            if (textAlign === 'left') {
                // 如果是右对齐，那x轴在块的最左边
                textX = x + padding;
            } else if (textAlign === 'center') {
                textX = blockWidth / 2 + x;
            } else {
                textX = x + blockWidth - padding;
            }
        }   else {
            blockWidth = width;
        }
        // 绘制背景色
        if(backgroundColor) {
            // 画面
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = backgroundColor;
            if (borderRadius > 0) {
                // 画圆角矩形
                let drawData = {
                    x, y, w: blockWidth, h: height, r: borderRadius
                };
                this.drawRadiusRect(drawData);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(this.toScale(x), this.toScale(y), this.toScale(blockWidth), this.toScale(height));
            }
            this.ctx.restore();
        }
        // 绘制边框
        if (borderWidth) {
            // 画线
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            borderColor && (this.ctx.strokeStyle = borderColor);
            this.ctx.lineWidth = borderWidth
            // 如果存在圆角,画圆角矩形边框
            if (borderRadius > 0) {
                let drawData = {
                    x, y, w: blockWidth, h: height, r: borderRadius,
                }
                this.drawRadiusRect(drawData);
                this.ctx.stroke();
            } else {
                this.ctx.strokeRect(this.toScale(x), this.toScale(y), this.toScale(blockWidth), this.toScale(height));
            }
            this.ctx.restore();
        }
        // 绘制文本
        if (text) {
            this.drawText(Object.assign(text, { x: textX, y: textY, text: txt }))
        }
        return blockWidth
    }

     /**
     * 计算文本宽度
     * @private
     * @param {string} _text
     * @param {number} fontSize
     * @returns
     * @memberof DrawComponent
     */
    private _getTextWidth(_text: string, fontSize: number) {
        return this.ctx.measureText(_text).width;
    }

    /**
     * 图片加载
     * @private
     * @param {string} url
     * @returns
     * @memberof CanvasDrew
     */
    private loadImage(url: any): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'Anonymous'
            img.onload = () => {
                resolve(img)
            }
            img.onerror = () => {
                reject(new Error('That image was not found.:' + url.length))
            }
            img.src = url // 针对跨域要做处理
        })
    }

     /**
     * 清除联动
     * @private
     * @param {*} closeStatue
     * @memberof DrawComponent
     */
    private clear(closeStatue) {
        // 全部清除
        if(Array.isArray(closeStatue)) {
            this.upY = 0
            this.upX = 0
        } else {
            // 清除Y轴联动
            if(Object.is(closeStatue, 'Y')) {
                this.upY = 0
            }
            // 清除X轴联动
            if(Object.is(closeStatue, 'X')) {
                this.upX = 0
            }
        }
    }
}

export default CanvasDrew
