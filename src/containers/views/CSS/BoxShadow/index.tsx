import React, { useEffect, useState, useRef } from 'react'
import './style.less'

const BoxShadow: React.FC = () => {
    return (
        <div className="bs-box flex wrap">
            <div className="bs-com-box">
                <div className="shadow flex-center">使用阴影的扩散半径实现内切圆角</div>
                <div className="shadow2 flex-center">阴影实现缺点，单个标签最多是2边</div>
                <div className="linear flex-center">使用径向渐变实现内切圆角</div>
                <div className="linea2 flex-center">径向渐变实现内切圆角可以是4边</div>
            </div>
        </div>
    )
}

export default BoxShadow