import React, { useEffect, useState, useRef, EventHandler } from 'react'
import './style.less'

const ClipPath: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>();
    const dirRef = useRef<number>(0) // 0: 正向， 1: 反向
    useEffect(() => {
        const parallax: HTMLDivElement = document.querySelector(".cp-clip-container");
        const foreground: HTMLDivElement = parallax.querySelector(".foreground");
        const background: HTMLDivElement = parallax.querySelector(".background");
        const h = scrollRef.current.clientHeight - 80;
        let t
        let percentage: number
        scrollRef.current.addEventListener('scroll', (e: any) => {
            const top = e.target.scrollTop
            console.log(top, t)
            // 正方向
            if (top == 0 && dirRef.current !== 0) {

            }
            // 反方向
            if (top < (t)) {
                dirRef.current = 1;
                foreground.style.zIndex = "1";
                background.style.zIndex = "2";
                background.style["clip-path"] = "circle(0 at 100% 100%)";
                foreground.style["clip-path"] = "";
            } else {
                dirRef.current = 0
                foreground.style.zIndex = '2'
                background.style.zIndex = '1'
                background.style["clip-path"] = "";
            }
            // 
            if (dirRef.current === 1) {
                percentage = 1 - (top / h)
            } else if (dirRef.current === 0) {
                percentage = top / h
            }
            let radius =
                percentage *
                Math.sqrt(foreground.clientWidth ** 2 + foreground.clientHeight ** 2);
            if (dirRef.current === 0) {
                foreground.style["clip-path"] = `circle(${radius + "px"} at 0% 0%)`;
            } else if (dirRef.current === 1) {
                background.style["clip-path"] = `circle(${radius + "px"} at 100% 100%)`;
            }
            t = top
        })
        return () => {
            scrollRef.current.removeEventListener('scroll', () => { })
        }
    }, [])
    return (
        <div className="cp-clip-box" ref={scrollRef}>
            <div className="cp-clip-container" >
                <div style={{ position: 'relative' }} >
                    <div className="img foreground"></div>
                    <div className="img background"></div>
                </div>
            </div>
        </div>
    )
}

export default ClipPath