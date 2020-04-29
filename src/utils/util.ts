/*
 * @Author: your name
 * @Date: 2020-04-16 15:37:50
 * @LastEditTime: 2020-04-25 15:00:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/utils/util.ts
 */
export function requestFrame(cb: FrameRequestCallback & number) {
    return (requestAnimationFrame ||
        webkitCancelAnimationFrame ||
        function(callback) {
            setTimeout(callback, 1000 / 60)
        })(cb)
}
