import React, { useEffect, useState, useRef } from 'react'
import './style.less'

const BlendMode: React.FC = () => {
    return (
        <div className="bm-mode-boxs flex">
            <div className="bm-mode-info">
                <p>mix-blend-mode 和background-blend-mode类似</p>
                <p>mix-blend-mode: normal;          //正常</p>
                <p>mix-blend-mode: multiply;        //正片叠底</p>
                <p>mix-blend-mode: screen;          //滤色</p>
                <p>mix-blend-mode: overlay;         //叠加</p>
                <p>mix-blend-mode: darken;          //变暗</p>
                <p>mix-blend-mode: lighten;         //变亮</p>
                <p>mix-blend-mode: color-dodge;     //颜色减淡</p>
                <p>mix-blend-mode: color-burn;      //颜色加深</p>
                <p>mix-blend-mode: hard-light;      //强光</p>
                <p>mix-blend-mode: soft-light;      //柔光</p>
                <p>mix-blend-mode: difference;      //差值</p>
                <p>mix-blend-mode: exclusion;       //排除</p>
                <p>mix-blend-mode: hue;             //色相</p>
                <p>mix-blend-mode: saturation;      //饱和度</p>
                <p>mix-blend-mode: color;           //颜色</p>
                <p>mix-blend-mode: luminosity;      //亮度</p>
                <p>mix-blend-mode: initial;         //初始</p>
                <p>mix-blend-mode: inherit;         //继承</p>
                <p>mix-blend-mode: unset;           //复原</p>
            </div>
            <div className="bm-mode-container">
                <div className="bm-mode-video">
                    <video autoPlay muted loop poster="https://www.apple.com.cn/v/iphone-12/g/images/overview/camera/night_mode_01__dg8mk3qbqhci_large.jpg">
                        <source src="https://www.apple.com.cn/105/media/us/iphone-12/2020/7f5b7de7-9f8c-41eb-bf3b-f294773108e6/anim/video/large_2x.mp4" />
                    </video>
                    <p>PEPSI</p>
                </div>
                <div className="bm-container-text">
                    <p>TEXT WAVE</p>
                </div>
            </div>
        </div>
    )
}

export default BlendMode