import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Display } from './display'
import PubSub from 'pubsub-js'
import useRootStore from '@store/useRootStore'
import { Radio } from 'antd'
import './display.less'
import { toJS } from 'mobx'
import { hexToRgba } from '@utils/util'


type DisplayType = '3D' | '2D'

const zipFile = 'https://cdn-cn.printailor.com/websiteStatic/wasm/20211214/wasm_202112141854_2.zip'
const lowUrl = 'https://static-cn.printailor.com/sky/20211206/91ae9cc93e2501c859723d8ddcdcd5df.zip', sourceUrl = ' https://static-cn.printailor.com/sky/20211206/ee33c1c6a141e4412e453c699f8267a5.zip';
const tmpJS = 'http://biu-cn.dwstatic.com/seas/20211213/64f1d3016854efda3f6a9421d149d448.js'
const tmpWams = 'http://biu-cn.dwstatic.com/seas/20211213/cee729da954edd79031107a1b89d1c5d.wasm'

let isOnce = true

const DisplayCanvas: React.FC = () => {
    const displayRef = useRef<Display>()
    const previewRef = useRef<Record<string, any>>(); // 存储2/3D数据
    const canvasRef = useRef<HTMLCanvasElement>()
    const [displayRadio, setDisplayRadio] = useState<DisplayType>('3D')
    const [is2d, setIs2d] = useState<boolean>(false) // 当前是否只有2d模式s
    const [mockupList, setMockUpList] = useState<Record<string, any>[]>([]); // 存储2d数据
    const [targetSet, setTargetSet] = useState<Record<string, any>>() // 当前
    const { curDisignInfo, tmpInfo, bgColor, pList } = useRootStore().wasmStore

    // 初始化
    useEffect(() => {
        console.time('========================allLoad')
        const display = new Display(canvasRef.current);
        // 加载wasm 相关信息
        display.loadZip(zipFile);
        const init = () => {
            initDesigner();
            display.loadResource(lowUrl, sourceUrl);
            displayRef.current = display
            PubSub.subscribe("loaded", (e, data) => {
                // 2D 资源渲染
                if (Object.is(data, '2D')) {
                    console.log('2d======')
                    // 加载2D图片资源
                    loadTwoDRender();
                } else {
                    display.updateRender(1, 0, 0, { "0:Scale": 0.5 })
                    updateWasm();
                }
            })
        }
        init();
        return () => {
            displayRef.current.clearData();
            // displayRef.current = null
            // previewRef.current = null
            // canvasRef.current = null
        }
    }, [])


    // 监听displayRadio的变化
    useEffect(() => {
        if (Object.is(displayRadio, '2D') && isOnce) {
            displayRef.current?.open2DEffect();
            isOnce = false
        }
    }, [displayRadio])

    //  监听targetSet变化，触发重新渲染
    useEffect(() => {
        if (targetSet) {
            renderColor(targetSet)
            renderAllPic(targetSet)
        }
    }, [targetSet]);

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
        if (!modelList.length) {
            console.log('开启2d设置模式')
            setIs2d(true)
            setDisplayRadio('2D')
        }
        setMockUpList(mockList);
    }

    // 渲染3D 模型
    const updateWasm = () => {
        const { settingInfo } = curDisignInfo
        const canvas = document.querySelector('#styleCanvas') as HTMLCanvasElement
        const img = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        const data = new Uint8Array(img.data)
        displayRef.current.updateWasm(data, canvas.width, canvas.height, settingInfo, {
            clipIndex: 0,
            effectIndex: 0,
            icon: "",
            seek: 0.8,
            trackIndex: 1
        })
    }

    // 渲染2d 模型
    const loadTwoDRender = () => {
        loadMocksImage();
    }

    // 加载2D 图片数据
    const loadMocksImage = () => {
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
    const radioHandle = (e) => {
        const setting = previewRef.current?.find(
            (item: any) => item.type === e.target.value
        )?.setting;
        if (setting && setting.length) {
            onSeekClick(setting[0]);
        }
        setDisplayRadio(e.target.value)
    }

    // 点击切换封面
    const onSeekClick = useCallback((setting: Record<string, any>) => {
        if (setting) displayRef.current?.nativeSeek(setting.seek);
        setTargetSet(setting);
    }, []);


    // 修改背景色
    const renderColor = (target: Record<string, any>) => {
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
                    displayRef.current?.updateModelColor(colorObj, target || targetSet);
                    // changeAllSetting = false;
                }
            }
        }
    }


    // 渲染已绘制的数据
    const renderAllPic = (target?: Record<string, any>) => {
        pList.forEach((item) => {
            const { settingInfo } = item;
            const canvas = document.querySelector('#styleCanvas') as HTMLCanvasElement
            const img = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            const data = new Uint8Array(img.data)
            displayRef.current?.updateWasm(
                data,
                canvas.width,
                canvas.height,
                settingInfo,
                target,
            );
            displayRef.current?.updateRender(1, 0, 0, { "0:Scale": 0.5 })
        });
    }
    return (
        <div className="dc-display-box">
            <div className={`dc-canvas-box ${displayRadio === "2D"
                ? "display-model"
                : ""
                } ${mockupList.length > 1 ? 'show-slider' : ''}`}>
                <canvas ref={canvasRef} id="canvas"></canvas>
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
}

export default DisplayCanvas