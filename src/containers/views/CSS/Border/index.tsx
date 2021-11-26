import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Border: React.FC = () => {
    return (
        <div className="b-box">
            <h4>border:相关属性介绍
                <br />
                <span>blur(px):高斯模糊；如果想要两个物体融合必须两个物体上都存在blur属性</span>
                <span>brightness(%):亮度</span>
                <span>contrast(%):对比度</span>
                <br />
                <span>drop-shadow():阴影 比box-shadow、text-shadow更好；box-shadow 是给整个图片加阴影，而 drop-shadow 只是给不透明的部分加阴影</span>
                <br />
                <span>grayscale(%):灰度</span>
                <span>hue-rotate(deg):色相旋转</span>
                <span>invert(%):反转</span>
                <br />
                <span>opacity(%):透明度</span>
                <span>saturate(%):饱和度</span>
                <span>sepia(%):深褐色</span>
            </h4>
            <div className="flex wrap">
                <div className="b-com b-charge flex-center">
                    <div className="b-charge-box">
                        <div className="header"></div>
                        <div className="battery">
                        </div>
                        <div className="battery-copy">
                            <div className="g-wave"></div>
                            <div className="g-wave"></div>
                            <div className="g-wave"></div>
                        </div>
                    </div>
                </div>
                <div className="b-com b-loading flex-center">
                    <div className="b-loading-box"></div>
                </div>
                <div className="b-com b-hover flex-center">
                    <div className="b-hover-box"></div>
                </div>
            </div>
        </div>

    )
}

export default Border