import JSZip from 'jszip';
import axios from 'axios';
import PubSub from 'pubsub-js'
import { toJS } from 'mobx';

/**
 * JS 操作 C/C++ 相关API
 * @interface UitlsProps
 */
interface UitlsProps {
    nativeTimelineLoadConfig: (file: string, path: string) => boolean;
    nativeTimelineUpdateParam: (effect: number, param: string) => void;
    nativeTimelineGetTrackAt: (track: number) => number;
    nativeTimelineGetClipAt: (track: number, clip: number) => number;
    nativeTimelineGetEffectAt: (clip: number, effect: number) => number;
    nativeSetBackgroundColor: (r: number, g: number, b: number, a: number) => void;
    nativeUnzip: (file: string, path: string) => boolean;
    // 合成图片： key: number:  filename: string 文件路径 quality: number: 导出图片的质量
    nativeSnapshot: (key: number, filename: string, quality: number) => void;
    nativeSeek: (key: number) => void;
    nativeTimelineUpdateBinaryParam: (effect: number, key: string, data: number, w: number, h: number) => void;
    nativeTimelineFindObjectByName: (name: string) => number;
    nativeTimelineGetObjectType: (object: number) => number;
    nativeClipUpdateResource: (clip: number, path: string) => number;
    nativeInit: (width: number, height: number) => boolean;
    nativeResize: (width: number, height: number) => void;
    nativeReset: () => void;
    nativePlay: () => void;
    nativeSetLogCallback: (callback: number) => void;
    nativeSetMessageCallback: (callback: number) => void;
}

enum ModelObject { // 自增长值
    none = -1,
    timeline,
    track,
    clip,
    effect,
    transition
}

export class Display {
    private uitls?: UitlsProps
    private isWasmLoaded: boolean = false
    private dirName: string = ''
    private sourceUrl: string = ''
    private isZipLoaded: boolean = false
    private effectData: any
    private twoDData?: ArrayBuffer
    constructor(canvas: HTMLCanvasElement) {
        window.Module = {
            canvas: canvas, // 传递canvas过去，实现webgl绘制
            onRuntimeInitialized: () => {
                console.log('wasm初始化挂在成功')
                this.isWasmLoaded = true
                const { FS, IDBFS } = window
                // 使用IndexDB 
                FS.mkdir("/data"); // 存储目录
                FS.mount(IDBFS, {}, "/data"); // 使用IndexDB存储文件,
                FS.syncfs(true, function (err: Error) { // syncfs()方法进行内存数据与IndexedDB的双向同步
                    console.log("FS ERROR", err);
                });
                this.onWasmLoad();
                this.openEffect()
                console.timeEnd("########loadWasm")
            }
        }
    }

    /**
     * 初始化数据
     * @param {string} zipUrl
     * @memberof Display
     */
    async loadZip(zipUrl: string) {
        const files = await this.loadZipFile(zipUrl)
        try {
            const pList = []
            let p: any;
            let jsTxt: any
            for (const filename of Object.keys(files)) {
                if (/\.(js)$/.test(filename)) {
                    p = files[filename].async('text').then((content) => {
                        jsTxt = content
                        return 2
                    })
                } else {
                    p = files[filename].async('arraybuffer').then((res) => {
                        const { Module } = window;
                        window.Module = {
                            ...Module,
                            wasmBinary: new Uint8Array(res), //  获取公共内存区域
                        }
                        return 1
                    });
                }
                pList.push(p)
            }
            Promise.all(pList).then(() => {
                const script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.text = jsTxt;
                document.body.appendChild(script);
                document.body.removeChild(script);
            })
        } catch (error) {
            console.error('error')
        }
    }

    /**
     * 加载解析zip文件
     * @param {string} zipUrl
     * @return {*} 
     * @memberof Display
     */
    private async loadZipFile(zipUrl: string) {
        console.time("########loadWasm")
        console.time('loading')
        console.time('#loadingZip')
        const response = await this.loadZipRequst(zipUrl);
        console.timeEnd('#loadingZip')
        const zipData = await JSZip.loadAsync(response.data).then((zip) => {
            return zip
        });
        console.timeEnd('loading')
        return zipData.files
    }

    /**
     * 加载zip 文件
     * @param {string} zipUrl
     * @return {*} 
     * @memberof Display
     */
    private async loadZipRequst(zipUrl: string) {
        return await axios({
            url: zipUrl,
            method: "GET",
            responseType: "arraybuffer",
        })
    }

    /**
     * JS 调用C/C++方法,可以传递不同类型的参数;因为JS和C/C++ 只有Number类型是相通的。传递其他类型会报错，为了解决这个问题，Module提供了两个方法ccall/cwrap。 
     * Number类型不能是64位整数型，因为JS会丢失精度、会截取。所以C/C++不能返回64位数
     * cwrap(ident, returnType, argTypes) ident: C导出的函数名称, returnType: 返回的类型。 argTypes: C导出函数接受参数的类型
     * @memberof Display
     */
    private onWasmLoad() {
        const { Module } = window;
        this.uitls = {
            // 加载sky文件
            nativeTimelineLoadConfig: Module.cwrap("nativeTimelineLoadConfig", "bool", ["string", "string",]),
            // 更新Effect下的信息
            nativeTimelineUpdateParam: Module.cwrap("nativeTimelineUpdateParam", null, ["number", "string"]),
            // 根据下标找到 TrackList
            nativeTimelineGetTrackAt: Module.cwrap("nativeTimelineGetTrackAt", "number", ["number"]),
            // 根据下标Clip
            nativeTimelineGetClipAt: Module.cwrap("nativeTimelineGetClipAt", "number", ["number", "number"]),
            // 根据下标找到Effect
            nativeTimelineGetEffectAt: Module.cwrap("nativeTimelineGetEffectAt", "number", ["number", "number"]),
            // 解压zip文件
            nativeUnzip: Module.cwrap("nativeUnzip", "bool", ["string", "string"]),
            // 合成图片；  key: number:  filename: string 文件路径 quality: number: 导出图片的质量
            nativeSnapshot: Module.cwrap("nativeSnapshot", null, ["number", "string", "number"]),
            // 修改Seek参数
            nativeSeek: Module.cwrap("nativeSeek", null, ["number"]),
            // 修改背景色
            nativeSetBackgroundColor: Module.cwrap("nativeSetBackgroundColor", null, ["number", "number", "number", "number",]),
            // 根据name 修改数据
            nativeTimelineUpdateBinaryParam: Module.cwrap("nativeTimelineUpdateBinaryParam", null, ["number", "string", "number", "number", "number"]),
            // 开始渲染
            nativePlay: Module.cwrap('nativePlay', null, null),
            // 初始化数据
            nativeInit: Module.cwrap('nativeInit', "bool", ['number', 'number']),
            // 重置数据
            nativeReset: Module.cwrap("nativeReset", null, null),
            // 监听窗口变化
            nativeResize: Module.cwrap('nativeResize', null, ['number', 'number']),
            // 根据Effect name查找effect 对象
            nativeTimelineFindObjectByName: Module.cwrap('nativeTimelineFindObjectByName', "number", ["string"]),
            // 
            nativeTimelineGetObjectType: Module.cwrap("nativeTimelineGetObjectType", "number", ["number"]),
            nativeClipUpdateResource: Module.cwrap("nativeClipUpdateResource", null, ["number", "string"]),
            nativeSetLogCallback: Module.cwrap("nativeSetLogCallback", null, ["number"]),
            nativeSetMessageCallback: Module.cwrap("nativeSetMessageCallback", null, ["number"])
        };
        Module["doNotCaptureKeyboard"] = true;
        try {
            // 初始化设置背景色
            this.uitls.nativeSetBackgroundColor(1.0, 1.0, 1.0, 1.0);
            // 设置canvas的大小
            this.uitls?.nativeInit(1200, 1200);
        } catch (error) {
            console.log(error, 'error')
        }
    }

    /**
     * 加载VOO 3D编辑器资源
     * @param {string} lowUrl
     * @param {string} [sourceUrl]
     * @memberof Display
     */
    async loadResource(lowUrl: string, sourceUrl?: string) {
        console.time('====loadResource====')
        const arr = lowUrl.split('/');
        const path = arr[arr.length - 1].split('.')[0];
        this.dirName = `/data/${path}` || '/data/cloth';
        this.sourceUrl = sourceUrl || ''; // 2d 资源信息
        this.load2DSource(); // 加载2d 资源
        try {
            const res = await this.loadZipRequst(lowUrl)
            this.effectData = new Uint8Array(res.data);
            this.isZipLoaded = true
            console.timeEnd('====loadResource====')
            this.openEffect();
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * 获取VOO资源写入C/C++
     * @private
     * @memberof Display
     */
    async openEffect() {
        const { FS } = window;
        if (this.isZipLoaded && this.isWasmLoaded && this.effectData) {
            console.time('###openLowEffect')
            // C/C++中写入文件
            FS.writeFile(`${this.dirName}.zip`, this.effectData);
            // 调用syncfs异步函数。判断是否成功
            FS.syncfs((err: Error) => {
                console.log("syncfs success?" + (!err ? "YES" : "NO"));
                this.uitls?.nativeUnzip(`${this.dirName}.zip`, this.dirName);
                // 调用C/C++ 方法; // 加载timeline.sky文件
                this.uitls?.nativeTimelineLoadConfig(
                    `${this.dirName}/timeline.sky`,
                    this.dirName
                );
                this.uitls?.nativePlay();
                PubSub.publish('loaded', '3D')
                console.timeEnd('###openLowEffect');
            });
        }
    }

    /**
     * 更新渲染数据。
     * @param {number} t
     * @param {number} c
     * @param {number} e
     * @param {Record<any, any>} param
     * @memberof Display
     */
    updateRender(t: number, c: number, e: number, param: Record<any, any>) {
        const track = this.uitls?.nativeTimelineGetTrackAt(t) || 0;
        console.log("track = " + track);
        const clip = this.uitls?.nativeTimelineGetClipAt(track, c) || 0;
        console.log("clip = " + clip);
        const effect = this.uitls?.nativeTimelineGetEffectAt(clip, e) || 0;
        console.log("effect = " + effect);
        // 修改当前effect 下的ofParam数据
        this.uitls?.nativeTimelineUpdateParam(
            effect,
            JSON.stringify({ ofParam: param })
        );
    };

    /**
     * 调用C/C++ 绘制图形到模型器
     * @param {Uint8Array} data
     * @param {number} width
     * @param {number} height
     * @param {*} settingInfo
     * @param {*} [target]
     * @memberof Display
     */
    updateWasm(data: Uint8Array, width: number, height: number, settingInfo: any, target?: any) {
        if (settingInfo) {
            const obj = { ...toJS(settingInfo) } // 这里是直接修改mobx数据，需要浅拷贝
            let effect = 0;
            if (target) {
                // 获取.sky文件 trackList下标数据
                const track = this.uitls?.nativeTimelineGetTrackAt(target.trackIndex) || 0;
                // 获取.sky文件trackList下标下的clipList下的下标数据
                const clip = this.uitls?.nativeTimelineGetClipAt(track, target.clipIndex) || 0;
                // 获取 effects数组下的某个下标数据
                effect = this.uitls?.nativeTimelineGetEffectAt(clip, target.effectIndex) || 0;
            }
            const { paramSettingInfo } = obj;
            if (!obj.binary) {
                // 分配一块内存
                const ptr = window.Module._malloc(data.byteLength);
                obj["binaryPtr"] = ptr;
            }
            obj["binary"] = this.updateWASMHeap(obj["binaryPtr"], data);
            paramSettingInfo.forEach((it: {
                paramType: string; filterIndex: string; paramName: string; objName: string
            }) => {
                if (it.objName) {
                    effect = this.uitls?.nativeTimelineFindObjectByName(it.objName) || 0;
                }
                switch (it.paramType) {
                    case "binary":
                        // 修改binary的参数
                        this.uitls?.nativeTimelineUpdateBinaryParam(effect, it.filterIndex + ":" + it.paramName, obj["binary"].byteOffset, width, height);
                        break;
                    case "randomNum":
                        const r = Math.floor(Math.random() * 99999);
                        // 修改ofParam 数据
                        this.uitls?.nativeTimelineUpdateParam(effect, JSON.stringify({ ofParam: { [`${it.filterIndex + ":" + it.paramName}`]: r } }));
                        break;
                }
            });
        }
    }

    /**
     *  针对其他类型的数据，处理成Uint8Array的数据，传递给C/C++
     * @param {*} ptr
     * @param {Uint8Array} data
     * @return {*} 
     * @memberof Display
     */
    updateWASMHeap(ptr: any, data: Uint8Array) {
        const heapBytes = new Uint8Array(window.Module.HEAPU8.buffer, ptr, data.byteLength);
        heapBytes.set(new Uint8Array(data.buffer));
        return heapBytes;
    }


    /**
     * 加载2d 资源信息
     * @memberof Display
     */
    async load2DSource() {
        if (!this.sourceUrl) return false
        console.time("==============load2DSource==============")
        const res = await this.loadZipRequst(this.sourceUrl);
        const arr = new Uint8Array(res.data);
        this.twoDData = arr
        console.timeEnd("==============load2DSource==============")
    }


    /**
     * 2D 模型渲染
     * @memberof Display
     */
    open2DEffect() {
        const { FS } = window;
        if (this.isZipLoaded && this.isWasmLoaded && this.twoDData) {
            console.timeEnd('###openHighEffect');
            FS?.writeFile(`${this.dirName}.zip`, this.twoDData);
            FS?.syncfs((err: Error) => {
                console.log("syncfs success?" + +(!err ? "YES" : "NO"));
                this.uitls?.nativeUnzip(`${this.dirName}.zip`, this.dirName);
                this.uitls?.nativeTimelineLoadConfig(
                    `${this.dirName}/timeline.sky`,
                    this.dirName
                );
                this.uitls?.nativePlay();
                PubSub.publish('loaded', '2D')
                console.log('###openHighEffect')
                console.timeEnd('###openHighEffect');
                performance.mark('openHighEffectEnd');
            });
        }
    }

    /**
     * 修改seek的值, 指的是当前effect下的参数seek值
     * @param {number} seekNumber
     * @memberof Display
     */
    nativeSeek(seekNumber: number) {
        this.uitls?.nativeSeek(seekNumber);
    }


    /**
     * 加载图片资源转换成 Blob，添加到FileReader中
     * @param {string} filepath
     * @param {(url: string) => void} callback
     * @return {*} 
     * @memberof Display
     */
    loadFile(filepath: string, callback: (url: string) => void) {
        const data = window.FS.readFile(`${this.dirName}/${filepath}`, { encoding: "binary" });
        const blob = new Blob([data]);
        const fr = new FileReader();
        fr.onload = (e: any) => {
            console.log("loadFile success ? ");
            callback(e.target.result);
        };
        fr.readAsDataURL(blob);
    }

    /**
     * 修改背景颜色
     * @param {Record<any, any>} colors
     * @param {Record<string, any>} target
     * @memberof Display
     */
    updateModelColor(colors: Record<any, any>, target: Record<string, any>) {
        const { trackIndex = 1, clipIndex = 0, effectIndex = 0 } = target;
        this.updateRender(trackIndex, clipIndex, effectIndex, colors);
    }

    /**
     * 清除
     * @memberof Display
     */
    clearData() {
        const { FS } = window;
        delete this.effectData;
        delete this.twoDData
        FS.unmount("/data"); // 卸载
        FS.rmdir("/data"); // 删除
        this.isWasmLoaded = false;
        this.isZipLoaded = false
    }

    /**
     *  根据effect的name查找当前的effect对象,然后更新ofParam数据
     * @param {string} objName
     * @param {Record<any, any>} param
     * @memberof Display
     */
    updateParamByName(objName: string, param: Record<any, any>) {
        // 根据name 获取effect 
        const obj = this.uitls?.nativeTimelineFindObjectByName(objName) || 0;
        const type = this.uitls?.nativeTimelineGetObjectType(obj);
        if (type === ModelObject.effect) {
            this.uitls?.nativeTimelineUpdateParam(obj, JSON.stringify({ ofParam: param }));
        }
    }

    /**
     * 导出
     * @param {number} seekNumber
     * @return {*} 
     * @memberof Display
     */
    downloadFileInIndexedDB(seekNumber: number) {
        this.uitls?.nativeSnapshot(seekNumber, "/data/snapshot_" + parseInt(`${seekNumber}`) + ".png", 100);
        const data = window.FS.readFile("/data/snapshot_" + parseInt(`${seekNumber}`) + ".png", { encoding: "binary" });
        return new Blob([data]);
    }
}
