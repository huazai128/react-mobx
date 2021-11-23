import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const BoxShadow: React.FC = () => {
    return (
        <div className="bs-box">
            <h4>box-shadow: x(x轴偏移量) y(y轴偏移量) blur-radius(模糊半径) spread-radius(限制模糊半径范围) color(颜色)
                <br />
                <span>单侧投影的核心是第四个参数：扩张半径。这个参数会根据你指定的值去扩大或缩小投影尺寸，如果我们用一个负的扩张半径，而他的值刚好等于模糊半径，那么投影的尺寸就会与投影所属的元素尺寸完全一致，除非使用偏移量来移动他，否则我们将看不到任何投影。</span>
            </h4>
            <div className="flex wrap">
                <div className="bs-com-box">
                    <div className="shadow flex-center"><p>使用阴影的扩散半径实现内切圆角</p></div>
                    <div className="shadow2 flex-center"><p>阴影实现缺点，单个标签最多是2边</p></div>
                    <div className="linear flex-center"><p>使用径向渐变实现内切圆角</p></div>
                    <div className="linea2 flex-center"><p>径向渐变实现内切圆角可以是4边</p></div>

                    <br />
                </div>
                <div className="bs-btn-box">
                    <div className="bs-btn-hover flex-center">Hover Me</div>
                    <div className='bs-h left'>左</div>
                    <div className='bs-h right'>右</div>
                    <div className='bs-h top'>上</div>
                    <div className='bs-h bottom'>下</div>
                    <div className="bs-com g-left"><div></div></div>
                    <div className="bs-shadow"></div>
                    <div className="bs-gradient"></div>
                </div>

            </div>

        </div >
    )
}

export default BoxShadow