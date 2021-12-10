import React, { Component } from 'react'
import DisignBlock from './components/DesignBlock'
import DisplayCanvas from './components/DisplayBlock/DisplayCanvas'
import './style.less'

const WasmCanvas: React.FC = () => {
    return (
        <div className="wc-canvas-box">
            <DisplayCanvas />
            <DisignBlock />
        </div>
    )
}

export default WasmCanvas