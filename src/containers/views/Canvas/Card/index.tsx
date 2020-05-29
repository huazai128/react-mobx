import * as React from 'react'
import PhonePage from '@components/PhonePage'
import { Row, Col, Input, Select, Button, message } from 'antd'
import { CanvasParams, ImgParams, AllParams } from '@interfaces/card.interface'
import { observer, useObserver } from 'mobx-react'
import useRootStore from '@store/useRootStore'
import './style.less'

const { Option } = Select

// https://img.qlchat.com/qlLive/admin/YV5AM8TM-7ZLX-TGXN-1587889016351-IU3Q9XY8E4G3.png

/**
 * 通用画卡功能
 * useState 不能监听对象
 * @returns
 */
function Card() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { isdisable, changeCanvas, saveCanvasParams, canvasParams, imgParams, changeImgParams, saveDrewImg } = useRootStore().cardStore
    return (
        <div className="card-box">
            <PhonePage className="flex-1">
                <canvas ref={canvasRef}></canvas>
            </PhonePage>
            <div className="card-controll">
                <Row gutter={24}>
                    <Col className="gutter-row" span={16}>
                        <p>设置画布宽高</p>
                        <Input.Group compact>
                            <Input
                                style={{ width: '100px' }}
                                disabled={isdisable}
                                defaultValue={String(canvasParams.canvasWidth || '')}
                                placeholder="请输入宽度"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeCanvas(e, 'canvasWidth')}
                            />
                            <Input
                                style={{ width: '100px' }}
                                disabled={isdisable}
                                defaultValue={String(canvasParams.canvasHeight || '')}
                                placeholder="请输入高度"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeCanvas(e, 'canvasHeight')}
                            />
                        </Input.Group>
                        {!isdisable && <Button onClick={() => saveCanvasParams(canvasRef.current)}>保存画布宽高</Button>}
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <br />
                        <p>绘制背景、绘制带有圆角的图片、绘制圆形图片</p>
                        <Input
                            defaultValue={imgParams.imgUrl}
                            style={{ width: 400 }}
                            value={imgParams.imgUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, 'imgUrl')}
                            placeholder="输入图片链接"
                        />
                        <br />
                        <Input.Group compact>
                            <Input
                                style={{ width: '100px' }}
                                defaultValue={String(imgParams.width || '')}
                                value={imgParams.width}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, 'width')}
                                placeholder="请输入宽度"
                            />
                            <Input
                                style={{ width: '100px' }}
                                defaultValue={String(imgParams.height || '')}
                                value={imgParams.height}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, 'height')}
                                placeholder="请输入高度"
                            />
                            <Input
                                style={{ width: '100px' }}
                                defaultValue={String(imgParams.x || '')}
                                value={imgParams.x}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, 'x')}
                                placeholder="X轴距离"
                            />
                            <Input
                                style={{ width: '100px' }}
                                defaultValue={String(imgParams.y || '')}
                                value={imgParams.y}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, 'y')}
                                placeholder="Y轴距离"
                            />
                            <Input
                                style={{ width: '100px' }}
                                defaultValue={String(imgParams.r || '')}
                                value={imgParams.r}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeImgParams(e, 'r')}
                                placeholder="圆大小"
                            />
                        </Input.Group>
                        <Button onClick={saveDrewImg}>保存</Button>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <br />
                        <p>绘制文字</p>
                        <Input style={{ width: 400 }} placeholder="请输入文案" />
                        <br />
                        <Input.Group compact>
                            <Input style={{ width: '100px' }} placeholder="字体大小" />
                            <Input style={{ width: '100px' }} placeholder="字体颜色" />
                            <Input style={{ width: '100px' }} placeholder="X轴距离" />
                            <Input style={{ width: '100px' }} placeholder="Y轴距离" />
                        </Input.Group>
                        <Select style={{ width: 200 }} placeholder="字体粗细">
                            <Option value="500">500</Option>
                            <Option value="400">400</Option>
                            <Option value="600">600</Option>
                            <Option value="700">700</Option>
                            <Option value="800">800</Option>
                            <Option value="900">900</Option>
                        </Select>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <br />
                        <p>绘制背景</p>
                        <Input.Group compact>
                            <Input style={{ width: '100px' }} placeholder="背景颜色" />
                            <Input style={{ width: '100px' }} placeholder="X轴距离" />
                            <Input style={{ width: '100px' }} placeholder="Y轴距离" />
                            <Input style={{ width: '100px' }} placeholder="圆大小" />
                        </Input.Group>
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
