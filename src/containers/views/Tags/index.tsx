import * as React from 'react'
import { Row, Col } from 'antd'
import AddTag from './AddTag'
import TagList from './TagList'
import './index.scss'

export default function Tabs() {
    return (
        <Row gutter={16}>
            <Col xs={24} sm={6}>
                <AddTag />
            </Col>
            <Col xs={24} sm={18}>
                <TagList />
            </Col>
        </Row>
    )
}
