import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button, InputNumber } from 'antd';
import { fabric } from 'fabric'
import { drawArrow, download } from '@utils/util';
import { nanoid } from 'nanoid';
import PubSub from 'pubsub-js'
import useRootStore from '@store/useRootStore'
import logo from '@assets/images/react.png'
import msk from '@assets/images/msk.png'
import { toJS } from 'mobx';

const baseShapeConfig = {
    IText: {
        text: 'Holle World',
        width: 60,
        height: 60,
        fill: '#06c'
    },
    Triangle: {
        width: 100,
        height: 100,
        fill: '#06c'
    },
    Circle: {
        radius: 50,
        fill: '#06c'
    },
    Rect: {
        width: 60,
        height: 60,
        fill: '#06c'
    },
    Line: {
        width: 100,
        height: 1,
        fill: '#06c'
    },
    Arrow: {},
    Image: {},
    Mask: {}
}

// 删除按钮
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const Canvas = () => {
    const canvasRef = useRef(null)
    const [size, setSize] = useState([750, 600]);
    const { initAttr, controllType } = useRootStore().canvasStore
    useEffect(() => {
        const canvas = new fabric.Canvas('canvas', {
            backgroundColor: '#fff'
        });

        const init = () => {
            // 初始化
            const img = document.createElement('img');
            img.src = deleteIcon;
            // 自定义控制属性， 删除功能
            fabric.Object.prototype.controls.deleteControl = new fabric.Control({
                x: 0.5,
                y: -0.5,
                offsetY: -32,
                cursorStyle: 'pointer',
                mouseUpHandler: deleteObject,
                render: renderIcon,
                cornerSize: 24
            });
            const shape = new fabric.IText(nanoid(8), {
                text: 'Hello World',
                width: 60,
                height: 60,
                fill: '#333',
                left: 60,
                top: 60
            })
            canvas.add(shape)
            // 监听鼠标按下时删除制定属性后重启渲染
            function deleteObject(eventData: any, transform: any) {
                const target = transform.target;
                const canvas = target.canvas;
                canvas.remove(target);
                canvas.requestRenderAll();
                // return false
            }
            // 渲染删除icon
            function renderIcon(ctx: any, left: number, top: number, styleOverride: any, fabricObject: any) {
                const size = this.cornerSize;
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
                ctx.restore();
            }
            initEvent(canvas)
            canvasRef.current = canvas
        }
        // 添加元素
        PubSub.subscribe('addElement', (msg, { type, url }) => {
            if (canvas) {
                let shape = null
                switch (type) {
                    case 'IText':
                        shape = new fabric.IText(nanoid(8), {
                            ...baseShapeConfig[type],
                            left: size[0] / 3,
                            top: size[1] / 3
                        })
                        break;
                    case 'Triangle':
                        shape = new fabric.Triangle({
                            ...baseShapeConfig[type],
                            left: size[0] / 3,
                            top: size[1] / 3,
                        })
                        break;
                    case 'Circle':
                        shape = new fabric.Circle({
                            ...baseShapeConfig[type],
                            left: size[0] / 3,
                            top: size[1] / 3,
                        })
                        break;
                    case 'Rect':
                        shape = new fabric.Rect({
                            ...baseShapeConfig[type],
                            left: size[0] / 3,
                            top: size[1] / 3,
                        })
                        break;
                    case 'Line':
                        shape = new fabric.Line([10, 10, 120, 10], {
                            left: 100,
                            top: 100,
                            stroke: 'rgba(255,0,0,0.5)',
                            strokeWidth: 2
                        });
                        break;
                    case 'Image':
                        fabric.Image.fromURL(url || logo, function (oImg: any) {
                            oImg.scale(0.5).set({
                                left: size[0] / 3,
                                top: size[1] / 3,
                            });;//图片缩小10倍
                            canvas.add(oImg);
                        });
                        break;
                    case 'Arrow':
                        shape = new fabric.Path(drawArrow(0, 0, 100, 100, 30, 30), {
                            stroke: '#ccc',
                            fill: 'rgba(255,255,255,0)',
                            strokeWidth: 2,
                            angle: -90,
                            objectCaching: false,
                            left: size[0] / 3,
                            top: size[1] / 3
                        })
                        break;
                    case 'Mask':
                        fabric.Image.fromURL(msk, function (oImg: any) {
                            oImg.scale(0.5);//图片缩小10倍
                            canvas.add(oImg);
                        }, { crossOrigin: 'anonymous' });
                        break;
                    default:
                        break;
                }
                shape && canvas.add(shape)
            }
        })
        // 更新属性
        PubSub.subscribe('updateAttr', (msg, data) => {
            // 获取当前操作对象
            const obj = canvas.getActiveObject(); // 如果没有选中就返回为null;
            if (!!obj) {
                // 设置attr
                obj.set({ ...data })
                // 重新渲染
                canvas.renderAll();
            }
        })
        // 保存图片
        PubSub.subscribe('saveImg', () => {
            const ext = 'png';
            const base64 = canvasRef.current.toDataURL({
                format: ext,
                enableRetinaScaling: true
            })
            download(base64, nanoid(8) + '.png');
        })
        // 保存到模版中
        PubSub.subscribe('saveTpl', (msg, data) => {
            const json = canvas.toDatalessJSON();
            const id = nanoid(8);
            const tpls = JSON.parse(localStorage.getItem('tpls') || "{}")
            tpls[id] = { json, t: data };
            localStorage.setItem('tpls', JSON.stringify(tpls));
            const ext = 'png';
            const base64 = canvas.toDataURL({
                format: ext,
                enableRetinaScaling: true
            })
            const tplImgs = JSON.parse(localStorage.getItem('tplImgs') || "{}")
            tplImgs[id] = base64
            localStorage.setItem('tplImgs', JSON.stringify(tplImgs))
            PubSub.publish('saveSuccess', { id, t: data })
        })
        // 渲染模版
        PubSub.subscribe('renderJson', (msg, data) => {
            canvas.clear();
            canvas.backgroundColor = 'rgba(255,255,255,1)';
            canvas.loadFromJSON(data, canvas.renderAll.bind(canvas))
        })
        PubSub.subscribe('saveSvg', () => {
            const svg = canvas.toSVG();
            const blob = new Blob([svg], { type: "image/svg+xml" });
            const blobURL = URL.createObjectURL(blob);
            download(blobURL, nanoid(8) + '.svg');
        })
        // 监听事件
        const initEvent = (canvas: any) => {
            // 鼠标按下
            canvas.on('mouse:down', (e) => {
                if (e.target) {
                    const type = e.target.get('type');
                    console.log(type, ' type==')
                    const {
                        fill = '#0066cc',
                        stroke,
                        strokeWidth = 0
                    } = e.target
                    // 初始化属性
                    initAttr({ fill, stroke: stroke || '', strokeWidth: strokeWidth })
                    controllType(type)
                } else {
                    controllType('')
                }
            })
            // 鼠标移动
            canvas.on('mouse:move', () => {

            })
            // 鼠标放开
            canvas.on('mouse:up', () => {

            })
        }
        init();
    }, [])

    const updateSize = useCallback((type: 0 | 1, v: number) => {

    }, [])
    return (
        <section className="me-canvas flex-g-1">
            <div className="controlWrap">
                <div className="leftArea">
                    <div>
                        <span style={{ marginRight: '10px' }}>画布大小: </span>
                        <InputNumber size="small" min={1} defaultValue={size[0]} onChange={(v) => updateSize(0, v)} style={{ width: 60, marginRight: 10 }} />
                        <InputNumber size="small" min={1} defaultValue={size[1]} disabled style={{ width: 60 }} />
                    </div>
                </div>
                <div className="rightArea">
                    <Button className="btn" size="small">背景</Button>
                    <Button className="btn" size="small">清空</Button>
                    <Button className="btn" size="small">预览</Button>
                </div>
            </div>
            <div className="flex-hcenter">
                <canvas id="canvas" width={750} height={size[1]}></canvas>
            </div>
        </section>
    )
}

export default Canvas