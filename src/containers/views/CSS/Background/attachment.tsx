import React, { useEffect, useState, useRef, Fragment } from 'react'
import './style.less'

const Attachment: React.FC = () => {
    return (
        <div className="ba-box">
            <h4>background-attachment:
                <br />
                <span>scroll: 使用scroll的内部带有滚动条的元素内的背景图片不会因为滚动条滚动而改变位置;相对于图片的容器进行定位
                </span>
                <br />
                <span>local: 相对于内容进行定位</span>
                <br />
                <span>fixed: 相对于视口定位</span>
            </h4>
            <div className="flex wrap">
                <div className="ba-com-box ba-fixed flex-center flex-col">
                    <div className="ba-mo flex-center">
                        <p>
                            background-attachment: fixed <br />
                            + <br />
                            filter: bulr() <br />
                            实现毛玻璃效果
                        </p>
                    </div>
                </div>
                <div className="ba-com-box box-table">
                    <table>
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>姓名</th>
                                <th>地址</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="ba-scroll">
                        <table>
                            <tbody>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                                <tr>
                                    <td>2021-01-01</td>
                                    <td>XXXXX</td>
                                    <td>DDDDD</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Attachment