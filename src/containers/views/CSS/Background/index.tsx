import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Background: React.FC = () => {
    return (
        <div className="ba-box">
            <h4>background:
                <br />
                <span>conic-gradient: 圆锥渐变 圆锥渐变的渐变方向和起始点。起始点是图形中心，然后以顺时针方向绕中心实现渐变效果。目前浏览器支持不多</span>
                <br />
                <span>linear-gradient: 线性渐变 </span>
                <br />
                <span>repeating-linear-gradient: 重复线性渐变 </span>

            </h4>
            <div className="flex wrap">
                <div className="box-conic flex-center flex-col">
                    <div className="ba-conic-mo"></div>
                    <div className="ba-conic-biao"></div>
                    <div className="ba-conic-pie"></div>
                    <div className="ba-conic-radar"></div>
                </div>
                <div className="box-conic flex-center flex-col">
                    <div className="ba-conic-radar1"></div>
                    <div className="ba-linear-arrow"></div>
                    <div className="ba-linear-arrow1"></div>
                    <div className="ba-linear-jian"></div>
                    <div className="ba-linear-notching"></div>
                    <div className="ba-linear-bar"></div>
                </div>
            </div>
        </div>

    )
}

export default Background