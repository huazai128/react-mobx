import React from 'react'
import { Row, Col, Button, Upload as UploadBtn, Icon } from 'antd'
import useRootStore from '@store/useRootStore'
import { observer } from 'mobx-react'
import './style.less'

function Upload() {
    const { uploadOpts, beforeUpload, changeFile } = useRootStore().maxUploadStore
    return (
        <div className="upload">
            <div>
                <Row gutter={24}>
                    <Col span={24}>
                        <h4>大文件分片上传</h4>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '30px' }} gutter={24}>
                    <Col span={4} offset={4}>
                        <UploadBtn {...uploadOpts} beforeUpload={beforeUpload} onChange={changeFile}>
                            <Button>
                                <Icon type="upload" /> 上传文件
                            </Button>
                        </UploadBtn>
                    </Col>
                    <Col span={3}>
                        <Button>恢复</Button>
                    </Col>
                    <Col span={3}>
                        <Button>暂停</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default observer(Upload)
