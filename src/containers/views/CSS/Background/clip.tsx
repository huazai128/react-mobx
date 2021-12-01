import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Attachment: React.FC = () => {
    return (
        <div className="ba-box">
            <h4>background-clip:
                <br />
                <span>border-box: 默认值。背景绘制在边框方框内（剪切成边框方框）。</span>
                <br />
                <span>padding-box: 背景绘制在衬距方框内（剪切成衬距方框）</span>
                <br />
                <span>content-box: 背景绘制在内容方框内</span>
                <br />
                <span>text: 以区块内的文字作为裁剪区域向外裁剪</span>

            </h4>
            <div className="flex wrap">
                <div className="bl-clip-text flex-center flex-col">
                    <p data-text="Lorem ipsum dolor"> Lorem ipsum dolor </p>
                </div>
            </div>
        </div>

    )
}

export default Attachment