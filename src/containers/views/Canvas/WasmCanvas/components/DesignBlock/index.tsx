import React, { Fragment } from 'react'
import DisignCanvas from './DisignCanvas'
import DisignScene from './DisignScene'
// import useRootStore from '@store/useRootStore'
import './style.less'
import Controller from './Controller'

const DisignBlock = () => {
    return (
        <Fragment>
            <div className="db-disign-box">
                <DisignScene />
                <DisignCanvas />
            </div>
            <Controller />
        </Fragment>
    )
}

export default DisignBlock