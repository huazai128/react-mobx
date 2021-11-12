import React, { useState, useRef, Fragment } from 'react'
import { Button, Tooltip, Modal, InputNumber, Upload, Input, Select } from 'antd';
import {
    ArrowLeftOutlined,
    FontSizeOutlined,
    PictureOutlined,
    LineOutlined,
    BorderOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react'
import logo from '@assets/images/react.png'
import msk from '@assets/images/msk.png'
import useRootStore from '@store/useRootStore'
import PubSub from 'pubsub-js'

const options = ['normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800]

const Controller = observer(() => {
    const { insertElement, updateAttr, attrObj, type } = useRootStore().canvasStore
    const [isTplShow, setIsTplShow] = useState(false);
    const tplNameRef = useRef(null)

    const showTplModal = () => {
        setIsTplShow(true)
    }

    const saveImg = () => {
        PubSub.publish('saveImg')
    }

    const handleSaveTpl = () => {
        const value = tplNameRef.current.state.value
        PubSub.publish('saveTpl', value)
    }

    const saveSvg = () => {
        PubSub.publish('saveSvg')
    }

    // 上传配置
    const uploadCinfig = {
        action: '',
        beforeUpload(file: File) {
            return new Promise<void>(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    insertElement('Image', reader.result || logo)
                    resolve()
                };
            });
        },
    }

    return (
        <section className="me-controll">
            <div className="simpleTit">属性编辑</div>
            <div className="attrPanel">
                <span className="label">填充: </span>
                <input type="color" style={{ width: 60 }} value={attrObj.fill} onChange={(e: any) => updateAttr('fill', e.target.value)} />
                <span className="label">描边: </span><input type="color"
                    style={{ width: 60 }} value={attrObj.stroke} onChange={(e: any) => updateAttr('stroke', e.target.value)} />
                <span className="label">描边宽度: </span>
                <InputNumber size="small" min={0} style={{ width: 60 }} value={attrObj.strokeWidth} onChange={(value) => updateAttr('strokeWidth', value)} />
                {Object.is(type, 'i-text') && (
                    <Fragment>
                        <span className="label">字体: </span>
                        <Input size="small" style={{ width: 60 }} value={attrObj.fontFamily} onChange={(e) => updateAttr('fontFamily', e.target.value)} />
                        <span className="label">字体大小: </span>
                        <InputNumber size="small" style={{ width: 60 }} value={attrObj.fontSize} onChange={(value) => updateAttr('fontSize', value)} />
                        <span className="label">粗体: </span>
                        <Select size="small" style={{ width: 80 }}>
                            {options.map((item) => (
                                <Select.Option key={item} label={item} value={item}>{item}</Select.Option>
                            ))}
                        </Select>
                    </Fragment>
                )}
            </div>
            <div className="simpleTit">插入元素</div>
            <div className="shapeWrap">
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="text" onClick={() => insertElement("IText")}><FontSizeOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <Upload {...uploadCinfig} >
                            <div className="img"><PictureOutlined /></div>
                        </Upload>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="line" onClick={() => insertElement("Line")}><LineOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="rect" onClick={() => insertElement('Rect')}><BorderOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="circle" onClick={() => insertElement('Circle')}></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="tringle" onClick={() => insertElement('Triangle')}></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="arrow" onClick={() => insertElement('Arrow')}><ArrowUpOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="mask" onClick={() => insertElement('Mask')}><img src={msk} alt="" /></div>
                    </Tooltip>
                </div>
            </div>
            <div className="simpleTit">保存</div>
            <div className="operationArea">
                <Button type="primary" block className="control" onClick={saveImg}>保存图片</Button>
                <Button block className="control" onClick={showTplModal}>保存为模版</Button>
                <Button block className="control" onClick={saveSvg}>保存SVG</Button>
            </div>
            <Modal
                title="保存模版"
                visible={isTplShow}
                onCancel={() => setIsTplShow(false)}
                onOk={handleSaveTpl}
                width={500}
                okText="确定"
                cancelText="取消"
            >
                <div>
                    <label htmlFor="">模版名称: </label>
                    <Input placeholder="请输入模版名称" ref={tplNameRef} />
                </div>
            </Modal>
        </section>
    )
})

export default Controller