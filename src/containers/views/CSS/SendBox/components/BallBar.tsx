import React, { useEffect, useRef, useImperativeHandle, useState } from 'react'
import { animated, useSpring } from "react-spring";
import { mapping, angleToRadians } from '../math'

interface IPorps {
    increacing: boolean
}

const BallBar: React.FC<IPorps> = ({ increacing }: IPorps, ref) => {
    const barRef = useRef(null);
    const [startPos, setStartPos] = useState([0, 0]);
    const [endPos, setEndPos] = useState([0, 0]);
    const [velocity, setVelocity] = useState([0, 0]);
    const resetRef = useRef(true);

    const { x } = useSpring({
        from: { x: startPos[0] },
        to: { x: endPos[0] },
        reset: resetRef.current,
        config: {
            velocity: velocity[0] // 初始速度
        }
    })
    const { y } = useSpring({
        from: { y: startPos[1] },
        to: { y: endPos[1] },
        reset: resetRef.current,
        config: {
            velocity: velocity[1], // 初始速度
            friction: 12, // 弹簧阻力
            tension: 60, // 弹簧能量负荷
            clamp: true, // 一旦超出边界就停止弹簧
        }
    })
    useEffect(() => {
        resetRef.current = false
    }, [])
    useImperativeHandle(ref, () => ({
        play: (volumn: number) => {
            const radians = angleToRadians(mapping(volumn, 0, 100, 0, -45));
            const startY = Math.tan(radians) * 54;
            const startX = 0;
            const initalVelocity = mapping(volumn, 0, 100, 0, 999);
            const endX = mapping(volumn, 0, 100, 0, barRef.current.clientWidth);
            const endY = 0;

            setVelocity([
                initalVelocity * Math.cos(radians),
                initalVelocity * Math.sin(radians)
            ]);
            setStartPos([startX, startY]);
            setEndPos([endX, endY]);
            resetRef.current = true;
        }
    }), [])
    return (
        <div className="ball-bar">
            <div className="bar" ref={barRef} />
            {increacing ? null : (
                <animated.div
                    className="ball"
                    style={{
                        transform: y.to(
                            value => `translate3d(${x.to((value) => value)}px,${value}px,0)`
                        )
                    }}
                />
            )}
        </div>
    )
}

export default React.forwardRef(BallBar)