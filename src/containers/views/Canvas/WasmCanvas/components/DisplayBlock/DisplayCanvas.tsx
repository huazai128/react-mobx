import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Display } from './display'
import PubSub from 'pubsub-js'
import useRootStore from '@store/useRootStore'
import { Radio } from 'antd'
import { hexToRgba, requestFrame, loadImage } from '@utils/util'
import TWEEN from '@tweenjs/tween.js'; // 动画
import WebFont from "webfontloader"; // 字体加载
import './display.less'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'

type DisplayType = '3D' | '2D'
interface DownModel {
    isDg: boolean
    offsetX: number
    offsetY: number
    startX: number
    startY: number
}

const defaultConfig: DownModel = {
    isDg: false,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0
}

const zipFile = 'https://cdn-cn.printailor.com/websiteStatic/wasm/20211214/wasm_202112141854_2.zip'
const lowUrl = 'https://static-cn.printailor.com/sky/20211206/91ae9cc93e2501c859723d8ddcdcd5df.zip', sourceUrl = ' https://static-cn.printailor.com/sky/20211206/ee33c1c6a141e4412e453c699f8267a5.zip';
const tmpJS = 'http://biu-cn.dwstatic.com/seas/20211213/64f1d3016854efda3f6a9421d149d448.js'
const tmpWams = 'http://biu-cn.dwstatic.com/seas/20211213/cee729da954edd79031107a1b89d1c5d.wasm'

let isOnce = true
let stemp = 1;
let minSize = 0.2;
let maxSize = 5;

const DisplayCanvas: React.FC = observer(() => {
    const displayRef = useRef<Display>()
    const previewRef = useRef<Record<string, any>>(); // 存储2/3D数据
    const canvasRef = useRef<HTMLCanvasElement>()
    const tergetRef = useRef<Record<string, any>>() // 存储当前操作对象信息
    const boxRef = useRef<HTMLDivElement>()
    const downRef = useRef<DownModel>(defaultConfig)
    const infoRef = useRef<Record<string, any>>()
    const [displayRadio, setDisplayRadio] = useState<DisplayType>('3D')
    const [is2d, setIs2d] = useState<boolean>(false) // 当前是否只有2d模式
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [is2DLoading, setIs2DLoading] = useState(false)
    const [mockupList, setMockUpList] = useState<Record<string, any>[]>([]); // 存储2d数据
    const [targetSet, setTargetSet] = useState<Record<string, any>>() // 当前
    const { curDisignInfo, tmpInfo, bgColor, pList, curDisignId, makeMap } = useRootStore().wasmStore

    // 初始化
    useEffect(() => {
        const display = new Display(canvasRef.current);
        initDesigner();
        // 加载wasm 相关信息
        display.loadZip(zipFile);
        const init = () => {
            display.loadResource(lowUrl, sourceUrl);
            displayRef.current = display
            PubSub.subscribe("loaded", (e, data) => {
                setIsLoading(true)
                // 2D 资源渲染
                if (Object.is(data, '2D')) {
                    // 加载2D图片资源
                    loadTwoDRender();
                } else {
                    const div = document.getElementById("main-container");
                    let multiple = 450 / (div?.offsetHeight || 450);
                    stemp = multiple; // 当前缩放值
                    minSize = 0.2 * multiple; //重新设置最大值和最小值。
                    maxSize = 5 * multiple;
                    display.updateRender(1, 0, 0, { "0:Scale": multiple }) // 渲染
                    updateWasm();
                }
            })
            PubSub.subscribe('renderWasm', async (msg, data) => {
                // 这里存在闭包缺陷， 导致这里拿到的数据还是旧的curDisignInfo
                const imageData = await loadImage(data);
                updateWasm(imageData)
            })
        }
        // 监听鼠标滚动事件
        boxRef.current.addEventListener('mousewheel', mousewheel);
        init();
        return () => {
            displayRef.current.clearData();
            PubSub.clearAllSubscriptions();
            boxRef.current.removeEventListener('mousewheel', mousewheel);
            displayRef.current = null
            previewRef.current = null
            canvasRef.current = null
        }
    }, [])

    // 监听displayRadio的变化
    useEffect(() => {
        // 这里处理有问题
        if (Object.is(displayRadio, '2D') && isOnce) {
            displayRef.current?.open2DEffect();
            isOnce = false
        }
    }, [displayRadio])

    //  监听targetSet变化，触发重新渲染, 这里包含了已绘制的数据
    useEffect(() => {
        // 加载完成才能渲染
        if (targetSet && (Object.is(displayRadio, '3D') || (Object.is(displayRadio, '2D') && is2DLoading))) {
            setTimeout(() => {
                console.log('渲染了22')
                // 渲染背景
                renderColor()
                // 渲染已经绘制的裁片
                renderAllPic()
            }, 10)
        }
    }, [targetSet, displayRadio, is2DLoading]);

    // 更新当前绘制的裁片信息
    useEffect(() => {
        infoRef.current = toJS(curDisignInfo);
    }, [JSON.stringify(curDisignInfo)])


    // 监听切片切换,旋转裁片
    useEffect(() => {
        console.log('渲染了1')
        // 监听不同位置的下绘制，是改变Y轴
        if (curDisignId) {
            const { updateParam = {} } = curDisignInfo; // 这里能拿到最新的curDisignInfo
            if (!(updateParam instanceof Array)) {
                const { value = '' } = updateParam;
                // 选择背景旋转角度
                updateModelParam({ "0:ModelRotY": value, "0:ModelRotX": 0 });
                downRef.current = { ...downRef.current, offsetX: Number(value), offsetY: 0 }
            }
            renderAllPic()
        }
        // 渲染已经绘制的
    }, [curDisignId])

    // 初始化设计器， 解析数据判断渲染模式
    const initDesigner = () => {
        let preview = [];
        const { extObj: { inputList = [], preview: lowPreview = [], high = {} } = {}, } = tmpInfo || {};
        //如果有high，使用high
        if (high.hasOwnProperty('preview')) {
            const { preview: highPreview = [] } = high as any;
            preview = highPreview;
        } else {
            preview = lowPreview;
        }
        previewRef.current = preview;
        // 2D数据信息
        const mockList =
            preview?.find((item: any) => item.type === "2D")?.setting || [];
        // 判断是否存在3D 数据
        const modelList = preview?.find((item: any) => item.type === "3D")?.setting || [];
        let setObj = modelList[0]
        if (!modelList.length) {
            setIs2d(true)
            setDisplayRadio('2D')
            setObj = mockList[0]
        }
        setTargetSet(toJS(setObj)); // 这里是为了切换是监听用， 后面可以能要优化这里
        tergetRef.current = toJS(setObj) // 这里是为了获取
        setMockUpList(mockList);
    }

    // 渲染3D 模型, 这里值渲染当前操作的裁片
    const updateWasm = (imageData?: ImageData) => {
        const { settingInfo } = infoRef.current || curDisignInfo //
        const canvas = document.querySelector('#styleCanvas') as HTMLCanvasElement
        if (!imageData) {
            imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        }
        const data = new Uint8Array(imageData.data)
        displayRef.current.updateWasm(data, canvas.width, canvas.height, settingInfo, tergetRef.current) // 2d模式下不传递tergetRef.current
    }


    // 渲染2d 模型
    const loadTwoDRender = () => {
        loadMocksImage();
    }

    // 加载2D 图片数据
    const loadMocksImage = () => {
        console.time('###loadMockImage');
        const mockList = previewRef.current?.find((item: any) => item.type === "2D")?.setting || [];
        const prepList = mockList.map(
            (item: any) =>
                new Promise<number>((resolve, _reject) => {
                    displayRef.current?.loadFile(`${item.icon}`, (dataurl: string) => {
                        setMockUpList((list) =>
                            list.map((l) => {
                                if (l.seek === item.seek) {
                                    return {
                                        seek: l.seek,
                                        value: l.seek,
                                        url: dataurl,
                                        effectIndex: l.effectIndex,
                                        clipIndex: l.clipIndex,
                                        trackIndex: l.trackIndex,
                                    };
                                }
                                return l;
                            })
                        );
                        resolve(1);
                    });
                })
        );
        if (prepList.length) {
            Promise.all(prepList)
                .then(() => {
                    setIs2DLoading(true);  // 等待2D资源加载完成
                    console.log("all input load");
                    console.timeEnd('###loadMockImage');
                    performance.mark('loadMockImageEnd');
                })
                .catch(() => {
                    console.log("load file err");
                });
        } else {
            console.timeEnd('###loadMockImage');
        }
    }

    // 切换渲染模式。（3D/2D）
    const radioHandle = useCallback((e) => {
        const setting = previewRef.current?.find(
            (item: any) => item.type === e.target.value
        )?.setting;
        if (setting && setting.length) {
            onSeekClick(setting[0]);
        }

        setDisplayRadio(e.target.value)
    }, [])

    // 点击切换封面
    const onSeekClick = useCallback((setting: Record<string, any>) => {
        if (setting) displayRef.current?.nativeSeek(setting.seek);
        setTargetSet(setting);
        tergetRef.current = setting
    }, []);


    // 修改背景色
    const renderColor = () => {
        const { extObj: { inputList = [] } = {} } = tmpInfo || {};
        // 当前切片的输入id
        let colorConfigs = inputList.find(
            (item) => item.type === "colorMaterial"
        );
        if (!colorConfigs) {
            colorConfigs = inputList.find(
                (item) => item.type === "colorEffect"
            );
        }
        const updateParam = colorConfigs?.updateParam;
        const materialList = colorConfigs?.materialList;
        let modelPathName = "";
        // 获取颜色值
        const targetColorItem = materialList?.find(m => `#${m.hex}`.toLowerCase() === bgColor.toLowerCase());
        const rgbColor = targetColorItem?.paramValue || '';
        const rgbName = targetColorItem?.name || '';
        const paramValues = targetColorItem?.paramValues;
        const rgbColorValue = hexToRgba(bgColor); // 旧式颜色
        // 如果存在旧值，就渲染就得颜色, 这里的逻辑提供切换衣服颜色
        if (paramValues) {

        } else {
            // 默认渲染
            if (updateParam instanceof Array) {
                const colorObj = updateParam?.reduce((pre, cur) => {
                    const { paramKey = "", filterIndex = 0 } = cur;
                    const key = `${filterIndex}:${paramKey}`;
                    modelPathName = `${filterIndex}:ModelPathString`;
                    if (rgbColor) return { ...pre, [key]: { "resType": 1, "resName": rgbColor } };
                    return { ...pre, [key]: rgbColorValue }
                }, {} as Record<any, any>);
                if (colorObj && targetSet) {
                    colorObj[modelPathName] = rgbName;
                    displayRef.current?.updateModelColor(colorObj, tergetRef.current);
                }
            }
        }
    }

    // 渲染已绘制的数据 这个包含已绘制的数据
    const renderAllPic = () => {
        if (!isLoading) return false
        if (!!makeMap.size) {
            // 循环已经绘制的区域数据
            for (let [key, value] of makeMap) {
                const obj = pList.find((item) => item.id == key);
                const data = new Uint8Array(value.data);
                displayRef.current?.updateWasm(
                    data,
                    value.width,
                    value.height,
                    obj.settingInfo,
                    tergetRef.current
                );
            }
        } else {
            updateWasm();
        }
        displayRef.current?.updateRender(1, 0, 0, { "0:Scale": 0.5 })
    }

    // 鼠标按下
    const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = e
        const { offsetY, offsetX } = downRef.current
        downRef.current = {
            ...downRef.current,
            isDg: true,
            startX: clientX - offsetX, // 记录当前位置
            startY: clientY - offsetY,
        }
    }

    // 鼠标滑动
    const mouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { clientX, clientY } = e
        const { isDg, startX, startY } = downRef.current
        if (isDg) {
            let x = clientX - startX // 滑动位置减去按下时的位置
            let y = clientY - startY
            // 3D 才有旋转
            updateModelParam({ "0:ModelRotY": x, "0:ModelRotX": -y })
            // 保存滑动后的位置
            downRef.current = { ...downRef.current, offsetX: x, offsetY: y }
        }
    }
    // 兼容鼠标
    const mouseUp = () => {
        downRef.current = {
            ...downRef.current, // 保留上一次绘制的位置
            isDg: false
        }
    }

    // 根据参数渲染
    const updateModelParam = (param: Record<string, string | number>) => {
        const modelPreciew = previewRef.current?.find((item: any) => item.type === "3D")?.setting || [];
        const { objName, trackIndex = 1, clipIndex = 0, effectIndex = 0 } = modelPreciew[0] || {};
        if (objName) {
            // 通过名称修改
            displayRef.current?.updateParamByName(objName, param)
        } else {
            // 通过下标修改
            displayRef.current?.updateRender(trackIndex, clipIndex, effectIndex, param);
        }
    }

    const animate = () => {
        if (TWEEN.update()) {
            requestFrame(animate.bind(null));
        }
    };

    const tween = (original: number, target: number) => {
        TWEEN.removeAll();
        new TWEEN.Tween({
            stemp: original
        })
            .to({
                stemp: target
            }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(tween => {
                updateModelParam({ "0:Scale": tween.stemp })
            }).start();
        animate();
    }

    // 鼠标滚动
    const mousewheel = (e) => {
        if (e.wheelDelta) {
            if (e.wheelDelta < 0 && stemp > minSize) {
                tween(stemp, stemp * 0.95);
                stemp *= 0.95;
            } else if (e.wheelDelta > 0 && stemp < maxSize) {
                tween(stemp, stemp * 1.05);
                stemp *= 1.05;
            }
        }
    }

    return (
        <div className="dc-display-box" id="main-container">
            <div
                ref={boxRef}
                className={`dc-canvas-box ${displayRadio === "2D" ? "display-model" : ""} ${mockupList.length > 1 ? 'show-slider' : ''}`}>
                <canvas
                    onMouseDown={mouseDown}
                    onMouseMove={mouseMove}
                    onMouseUp={mouseUp}
                    ref={canvasRef}
                    id="canvas">
                </canvas>
            </div>
            <div className={`tab-container ${is2d ? 'disabled' : ''}`}>
                <Radio.Group
                    buttonStyle="solid"
                    defaultValue={displayRadio}
                    onChange={radioHandle}
                >
                    <Radio.Button value="3D" className="tab-btn">
                        3D
                    </Radio.Button>
                    <Radio.Button value="2D" className="tab-btn">
                        MockUp
                    </Radio.Button>
                </Radio.Group>
            </div>
        </div>
    )
})

export default DisplayCanvas