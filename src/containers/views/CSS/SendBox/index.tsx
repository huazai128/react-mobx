import React, { useEffect, useState, useRef } from 'react'
import BallBar from './components/BallBar'
import Shotter from './components/Shotter'
import { clamp } from './math'
import './style.less'

const speed = 1;

const SendBox: React.FC = () => {
    const [volumn, setVolumn] = useState<number>(0);
    const [increacing, setIncreacing] = React.useState(false);
    // 存储requestAnimationFrame
    const reqRef = useRef(null);
    const barRef = useRef();
    // 监听事件变化
    const toggle = () => {
        cancelAnimationFrame(reqRef.current)
        setIncreacing((val) => !val);
        if (increacing && barRef.current) {
            (barRef.current as any)!.play(volumn)
        }
    }
    useEffect(() => {
        // 定时任务
        function task() {
            setVolumn(v => clamp(v + speed, 0, 100));
            reqRef.current = requestAnimationFrame(() => {
                task();
            })
        }
        if (increacing) {
            task();
        } else {
            setVolumn(0)
        }
        return () => {
            cancelAnimationFrame(reqRef.current)
        }
    }, [increacing])
    return (
        <div className="send-box flex-center">
            <Shotter volumn={volumn} onMouseDown={toggle} onMouseUp={toggle} />
            <BallBar increacing={increacing} ref={barRef} />
        </div>
    )
}

export default SendBox