import React from 'react'
import * as styles from './index.scss'
import Header from './components/Header'
import AutoSizer from '@components/AutoSizer'
import ArticleTable from './components/ArticleTable/index'

export default function Article() {
    return (
        <div className={styles.articleBox}>
            <Header />
            <AutoSizer className={styles.articleTable}>{({ height }) => <ArticleTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
