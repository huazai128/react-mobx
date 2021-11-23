import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Filter: React.FC = () => {
    return (
        <div className="f-box">
            <h4>filter: x(x轴偏移量) y(y轴偏移量) blur-radius(模糊半径)  color(颜色)
                <br />
                <span>animation-direction属性取值有3个： normal	正方向播放（默认值）
                    reverse	反方向播放
                    alternate	播放次数是奇数时，动画正方向播放；播放次数是偶数时，动画反方向播放</span>
            </h4>
            <div ></div>
        </div>

    )
}

export default Filter