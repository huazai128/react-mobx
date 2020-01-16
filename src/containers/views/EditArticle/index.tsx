import React, { Fragment } from 'react'
import AutoSizer from '@components/AutoSizer'
import Edit from './Edit'
import * as styles from './index.scss'
import HeaderArticle from './Header'

export default function EditArticle() {
    return (
        <div className={ styles.editBox }>
            <HeaderArticle />
            <AutoSizer className={ styles.editBox }>
                { () => <Fragment><Edit /></Fragment>}
            </AutoSizer>
        </div>
    )
}
