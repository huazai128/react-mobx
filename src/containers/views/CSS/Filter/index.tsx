import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Filter: React.FC = () => {
    return (
        <div className="f-box">
            <h4>filter:相关属性介绍
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
                <div className="f-com f-filter-box flex-center">
                    <div className="g-container flex">
                        <div className="g-first"></div>
                        <div className="g-ball"></div>
                        <div className="g-ball"></div>
                        <div className="g-ball"></div>
                        <div className="g-ball"></div>
                        <div className="g-ball"></div>
                        <div className="g-ball"></div>
                        <div className="g-ball"></div>
                    </div>
                </div>
                <div className="f-com f-qiu flex-center">
                    <div className="container">
                        <div className="bg">
                            <div className="f-qiu-box"></div>
                        </div>
                    </div>
                </div>
                <div className="f-com f-path  flex-col">
                    <div className="btn-wrap">
                        <div className="btn flex-center">领取红包</div>
                    </div>
                    <div className="f-shui flex-hcenter">
                        <div className="text">MAGICCSS</div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Filter