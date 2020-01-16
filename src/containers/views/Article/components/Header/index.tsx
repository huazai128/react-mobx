import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col } from 'antd'
import SearchControl from '@components/SearchControl'
import * as styles from './index.scss'

interface IHeadProps {}

export default function Header({  }: IHeadProps): JSX.Element {
    return (
        <Row gutter={16}>
            <Col xs={{ span: 24 }} lg={{ span: 22 }}>
                <SearchControl />
            </Col>
            <Col xs={{ span: 6 }} lg={{ span: 2 }}>
                <Link className={styles.articleLink} to={'/article/edit'}>
                    <Button type="primary">新增文章</Button>
                </Link>
            </Col>
        </Row>
    )
}
