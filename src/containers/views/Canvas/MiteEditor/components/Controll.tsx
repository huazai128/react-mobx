import React, { Component } from 'react'
import { Button, Tooltip, Modal, InputNumber, Upload, Input } from 'antd';
import {
    ArrowLeftOutlined,
    FontSizeOutlined,
    PictureOutlined,
    LineOutlined,
    BorderOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';


const Controller = () => {
    const showTplModal = () => {

    }
    const saveImg = () => {

    }
    return (
        <section className="me-controll">
            <div className="simpleTit">属性编辑</div>
            <div className="attrPanel">
                <span className="label">填充: </span>
                <input type="color" style={{ width: 60 }} onChange={(e: any) => { }} />
                <span className="label">描边: </span><input type="color"
                    style={{ width: 60 }} onChange={(e: any) => { }} />
                <span className="label">描边宽度: </span>
                <InputNumber size="small" min={0} style={{ width: 60 }} onChange={(v) => { }} />
            </div>
            <div className="simpleTit">插入元素</div>
            <div className="shapeWrap">
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="text" onClick={() => { }}><FontSizeOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <Upload >
                            <div className="img"><PictureOutlined /></div>
                        </Upload>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="line" onClick={() => { }}><LineOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="rect" onClick={() => { }}><BorderOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="circle" onClick={() => { }}></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="tringle" onClick={() => { }}></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="arrow" onClick={() => { }}><ArrowUpOutlined /></div>
                    </Tooltip>
                </div>
                <div className="shape">
                    <Tooltip placement="bottom" title="点击使用">
                        <div className="mask" onClick={() => { }}><img src="" alt="" /></div>
                    </Tooltip>
                </div>
            </div>
            <div className="simpleTit">保存</div>
            <div className="operationArea">
                <Button type="primary" block className="control" onClick={saveImg}>保存图片</Button>
                <Button block className="control" onClick={showTplModal}>保存为模版</Button>
            </div>
        </section>
    )
}

export default Controller