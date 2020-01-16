import React from 'react'
import { Layout } from 'antd'
import * as styles from './index.scss'

export default function HeaderArticle(): JSX.Element {
    return (
        <Layout.Header className={ styles.header }>
            <h4>编辑文章内容</h4>
        </Layout.Header>
    )
}
