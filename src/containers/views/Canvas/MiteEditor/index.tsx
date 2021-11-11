import React, { Component, ChangeEventHandler } from 'react'
import { } from 'fabric'
import Template from './components/Template'
import Controller from './components/Controll'

const MituEditor = () => {

    return (
        <div className="me-box flex">
            <Template />
            <section className="me-canvas flex-g-1">

            </section>
            <Controller />
        </div>
    )
}
export default MituEditor