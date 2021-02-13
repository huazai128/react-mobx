import * as React from 'react'
import PhonePage from '@components/PhonePage'
import { Row, Col, Input, Select, Button, message, Radio } from 'antd'
import { CanvasParams, IImage } from '@interfaces/card.interface'
import { observer, useObserver } from 'mobx-react'
import useRootStore from '@store/useRootStore'
import CanvasBox from './components/CardBox'
import './style.less'

const { Option } = Select
const hideType = ['status', 'closeStatue', 'zIndex']

/**
 * 通用画卡功能
 * useState 不能监听对象
 * @returns
 */
function Card() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { changeCanvas, saveCanvasParams, canvasParams, imgParams, changeImgParams, saveDrewImg, blockList, blockParams,
        basieList, imgsList, textList, textParams, changeText, saveDrewText, handleSizeChange, drawType } = useRootStore().cardStore
    return (
        <div className="card-box">
            <PhonePage className="flex-1">
                <canvas ref={canvasRef}></canvas>
            </PhonePage>
            <div className="card-controll">
                <Row gutter={24}>
                    <Col className="gutter-row" span={16}>
                        <p>设置画卡基本参数</p>
                        <Input.Group compact>
                            { basieList.map((item, index) => (
                                <Input
                                    key={ index } 
                                    style={{ width:item.width || 100 }}
                                    value={String(canvasParams[item.type] || '')}
                                    placeholder={item.placeholder}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeCanvas(e, item.type)}
                                />
                            )) }
                        </Input.Group>
                        <Button onClick={() => saveCanvasParams(canvasRef.current)}>保存画布宽高</Button>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <br />
                        <p>绘制背景、绘制带有圆角的图片、绘制圆形图片</p>
                        { imgsList.map((item, index) => (
                            <Input
                                key={ index } 
                                style={{ width:item.width || 100 }}
                                value={String(imgParams[item.type] || '')}
                                placeholder={item.placeholder}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, item.type)}
                            />
                        )) }
                        <br />
                        <Button onClick={saveDrewImg}>保存</Button>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <br />
                        <p>绘制文本或者文本框</p>
                        <Radio.Group value={drawType} onChange={handleSizeChange}>
                            <Radio.Button value="text">绘制文字(单行或者多行文本包含中划线)</Radio.Button>
                            <Radio.Button value="block">绘制文本框（包含背景、边框效果）、文本对齐(如左对齐、右对齐居中等效果)</Radio.Button>
                        </Radio.Group>
                        <p></p>
                        { Object.is(drawType, 'block') && blockList.map((item, index) => {
                            if(!item.status){
                                return (
                                    <Input
                                        key={ index } 
                                        style={{ width:item.width || 100 }}
                                        value={blockParams[item.type] || ''}
                                        placeholder={item.placeholder}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeText(e, item.type)}
                                    />
                                )
                            } else {
                                return (
                                    <Select 
                                        placeholder={ item.placeholder } 
                                        mode={ item.status }
                                        value={ blockParams[item.type] }
                                        key={ index } style={{ width: 200 }} 
                                        onChange={(e) => changeText(e, item.type)}>
                                            { item.data.map((t,idx) => (
                                                <Option key={ idx } value={ t.type }>{ t.name }</Option>
                                            )) }
                                    </Select>
                                )
                            }
                        }) }
                        <p></p>
                        { textList.map((item,index) => {
                            if(Object.is(drawType, 'block') && hideType.includes(item.type)) return null
                            if(!item.status){
                                return (
                                    <Input
                                        key={ index } 
                                        style={{ width:item.width || 100 }}
                                        value={textParams[item.type] || ''}
                                        placeholder={item.placeholder}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeText(e, item.type, 'textParams')}
                                    />
                                )
                            } else {
                                return (
                                    <Select 
                                        placeholder={ item.placeholder } 
                                        mode={ item.status }
                                        value={ textParams[item.type] }
                                        key={ index } style={{ width: 200 }} 
                                        onChange={(e) => changeText(e, item.type, 'textParams')}>
                                            { item.data.map((t,idx) => (
                                                <Option key={ idx } value={ t.type }>{ t.name }</Option>
                                            )) }
                                    </Select>
                                )
                            }
                        }) }
                        <br />
                        <Button onClick={saveDrewText}>保存</Button>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <br />
                        <p>绘制直线</p>
                        <Input.Group compact>
                            <Input style={{ width: '100px' }} placeholder="线宽" />
                            <Input style={{ width: '100px' }} placeholder="起始坐标X" />
                            <Input style={{ width: '100px' }} placeholder="起始坐标Y" />
                            <Input style={{ width: '100px' }} placeholder="终止坐标X" />
                            <Input style={{ width: '100px' }} placeholder="终止坐标Y" />
                            <Input style={{ width: '100px' }} placeholder="填充颜色" />
                            <Input style={{ width: '100px' }} placeholder="边框颜色" />
                        </Input.Group>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default observer(Card)
