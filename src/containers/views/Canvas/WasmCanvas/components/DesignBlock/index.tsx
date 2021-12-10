import React, { Component } from 'react'
import DisignCanvas from './DisignCanvas'
import DisignScene from './DisignScene'
import useRootStore from '@store/useRootStore'
import './style.less'

const DisignBlock = () => {
    return (
        <div className="db-disign-box">
            <DisignScene />
            <DisignCanvas />
        </div>
    )
}

export default DisignBlock