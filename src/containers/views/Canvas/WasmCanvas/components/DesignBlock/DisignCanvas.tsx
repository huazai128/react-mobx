
import React, { useEffect, useRef, useState } from 'react'
import useRootStore from '@store/useRootStore'
import { fabric } from 'fabric'
import { nanoid } from 'nanoid';

interface IProps {
}
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const DisignStyle: React.FC = () => {
    const [sizes, setSizes] = useState([180, 180])
    const canvasRef = useRef<fabric.Canvas>()
    useEffect(() => {
        const canvas = new fabric.Canvas('styleCanvas', {
            backgroundColor: 'transparent'
        })
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'blue';
        fabric.Object.prototype.cornerStyle = 'circle';
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
                cornerSize: 20
            } as any);
            const shape = new fabric.IText(nanoid(8), {
                text: 'Hello World',
                fill: '#333',
                left: 20,
                top: 20,
                fontSize: 24
            })
            canvas.add(shape)
            // 监听鼠标按下时删除制定属性后重启渲染
            function deleteObject(eventData: any, transform: any, x, y) {
                const target = transform.target;
                const canvas = target.canvas;
                canvas.remove(target);
                canvas.requestRenderAll();
                return false
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
        }
        canvasRef.current = canvas
        init();
        listenEvent();
    }, [])

    const listenEvent = () => {
        canvasRef.current.on('mouse:down', () => {

        })
        canvasRef.current.on('mouse:move', () => {

        })
        canvasRef.current.on('mouse:over', () => {

        })
    }

    return (
        <div className="ds-style-box">
            <canvas id="styleCanvas" width={sizes[0]} height={sizes[1]}></canvas>
            {/* <div className=""></div> */}
        </div >
    )
}

const DisignCanvas: React.FC<IProps> = ({ }: IProps) => {
    const cvWh = useRef(700)
    const canvasRef = useRef()
    const { curDisignInfo } = useRootStore().wasmStore

    useEffect(() => {
        const canvas = new fabric.StaticCanvas('disignCanvas', {
            backgroundColor: '#fff'
        })
        fabric.Image.fromURL(curDisignInfo.backgroundUrl, function (oImg: any) {
            oImg.scale(0.345).set({
                left: 0,
                top: 0,
            });
            canvas.add(oImg);
        });

        canvas.renderAll();

    }, [])
    return (
        <div className="dc-canvas-box">
            <canvas id="disignCanvas" width={cvWh.current} height={cvWh.current}></canvas>
            <DisignStyle />
        </div>
    )
}

export default DisignCanvas;