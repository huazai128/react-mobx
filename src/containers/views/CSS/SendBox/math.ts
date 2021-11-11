
/**
 * 根据音量计算映射值;  将 0~100 的 volumn 映射到 circle 半径 0~240，旋转角度 0~-45deg
 * @param {number} num  当前音量
 * @param {number} inMin 最小音量
 * @param {number} inMax  最大音量
 * @param {number} outMin 最小距离
 * @param {number} outMax 最大距离
 * @return {*} 
 */
export const mapping = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}


/**
* 限制边界；限制音量的边界值
* @param {number} value: 当前值
* @param {number} min： 最小值
* @param {number} max：最大值
* @return {*} 
*/
export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};


/**
* 角度换成弧度
* @param {number} angle
*/
export const angleToRadians = (angle: number) => {
    return (angle / 180) * Math.PI;
}