import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Mask: React.FC = () => {
    return (
        <div className="mi-box">
            <h4>mask属性如下，和background的性质一样, 遮罩层(蒙城)效果:
                <br />
                <span>mask-image：和background-image用法一样</span>
                <br />
                <span>mask-mode：</span>
                <br />
                <span>mask-repeat：</span>
                <br />
                <span>mask-position：</span>
                <br />
                <span>mask-clip：</span>
                <br />
                <span>mask-origin：</span>
                <br />
                <span>mask-size</span>
                <br />
                <span>mask-type</span>
                <br />
                <span>mask-composite</span>
            </h4>
            <div className="flex wrap">
                <div className="mi-slide-box mi-com-box">
                    <div className="a"></div>
                    <div className="b"></div>
                </div>
            </div>
        </div>
    )
}

export default Mask