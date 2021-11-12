import React, { Component, ChangeEventHandler } from 'react'
import Template from './components/Template'
import Controller from './components/Controll'
import Canvas from './components/Canvas'
import './style.less'

const MituEditor = () => {

    return (
        <div className="me-box flex">
            <Template />
            <Canvas />
            <Controller />
        </div>
    )
}
export default MituEditor