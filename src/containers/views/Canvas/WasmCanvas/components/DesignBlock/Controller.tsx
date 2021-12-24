import React, { useState, useMemo, useEffect } from 'react'
import { Button, Radio, Checkbox, Input, message } from "antd";
import useRootStore from '@store/useRootStore'
import { observer } from 'mobx-react'
import './controller.less'
import ColorSelect from './ColorSelect';

const Controller = observer(() => {
    const { tmpInfo } = useRootStore().wasmStore
    const [techniqueId, setTechniqueId] = useState<string>();
    const [isReady, setisReady] = useState<boolean>(true);
    const [bgColor, setBgColor] = useState<string>('');

    useEffect(() => {

    }, [])

    const addImage = () => {

    }
    const tech = {
        items: []
    }
    const addText = () => {

    }
    const onCanva = () => {

    }
    const colorSelectHandle = (color: string) => {

    }

    const bgColorHandle = (color: string) => {

    }
    const { techList, colors, curTech } = useMemo(() => {
        const techList = tmpInfo?.properties?.find((i: any) => i.value === "TECHNIQUE")?.items || []
        const colors = tmpInfo.properties?.find((i: any) => i.value === "COLOR");
        const curTech = techList?.find((i) => i.id === techniqueId)?.value || '';
        return {
            techList,
            colors,
            curTech
        }
    }, [tmpInfo])
    return (
        <div className="db-controll-box">
            <div className="main-action">
                <div className="technique-container">
                    <h3>Technique</h3>
                    <div className="btn-container">
                        {techList.length ? (
                            techList.map((item: any) => (
                                <Radio.Button checked={item.id === techniqueId} key={item.id}>
                                    {item.label}
                                </Radio.Button>
                            ))
                        ) : (
                            <>
                                <Radio.Button checked={true} className="radio-btn">
                                    Printing(DTG)
                                </Radio.Button>
                                <Radio.Button checked={false} className="radio-btn">
                                    Embroidery
                                </Radio.Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="color-container">
                    <h3>Color Preview</h3>
                    <div className="checkbox-container">
                        {
                            curTech === 'AOP' ? (
                                <div style={{ width: '100%' }}>
                                    <ColorSelect
                                        color={'#fff'}
                                        showHex
                                        disableAlpha
                                        onChange={(color: any) => colorSelectHandle(color)}
                                        pColors={[
                                            '#000000', '#ffffff', '#bababa', '#696969', '#ead6bb', '#fecdcb',
                                            '#c70f28', '#f26522', '#603913', '#ffc829', '#fff2b3', '#54753f',
                                            '#7b8260', '#0e3d84', '#c1d9f7', '#b094c1'
                                        ]}
                                    />
                                </div>
                            ) : (
                                <>
                                    {
                                        colors ? (
                                            colors.items?.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="check-item"
                                                    style={{ backgroundColor: item.value }}
                                                    onClick={() => bgColorHandle(item)}
                                                >
                                                    {bgColor === item.value && <div className="check-icon"></div>}
                                                    {/* <img src={check}></img> */}
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className="check-item"
                                                style={{ backgroundColor: "#FFFFFF" }}
                                                onClick={() => bgColorHandle("#FFFFFF")}
                                            >
                                                {bgColor === "#FFFFFF" && <div className="check-icon"></div>}
                                                {/* <img src={check}></img> */}
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
                <div className="add-container">
                    <div className="btn-container add">
                        <Button
                            className="add-btn"
                            onClick={addImage}
                            type="dashed"
                            disabled={!isReady}
                        >
                            <i className="iconfont">&#xe619;</i>
                            <span>Add image</span>
                        </Button>
                        <Button
                            className="add-btn"
                            onClick={addText}
                            type="dashed"
                            disabled={!isReady}
                        >
                            <i className="iconfont">&#xe618;</i>
                            <span>Add text</span>
                        </Button>
                        <Button
                            className="add-btn"
                            type="dashed"
                            id="canva-btn"
                            onClick={onCanva}
                            disabled={!isReady}
                        >
                            <span>Add from</span>
                            <div className="canva-icon"></div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Controller