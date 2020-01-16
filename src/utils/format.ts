/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-29 17:58:24
 * @LastEditTime: 2019-08-29 18:28:47
 * @LastEditors: Please set LastEditors
 */

/**
 * 格式化日期
 * @export
 * @param {Date} date
 * @param {string} [formatStr]
 * @returns {string}
 */
export function formatDate(date: Date, formatStr?: string): string {
    if (!date) {
        return ''
    }
    let format = formatStr || 'yyyy-MM-dd'
    if ('number' === typeof date || 'string' === typeof date) {
        date = new Date(+date)
    }
    const map = {
        M: date.getMonth() + 1, // 月份
        d: date.getDate(), // 日
        h: date.getHours(), // 小时
        m: date.getMinutes(), // 分
        s: date.getSeconds(), // 秒
        q: Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    }
    format = format.replace(/([yMdhmsqS])+/g, (all: string, t: any) => {
        let v = map[t]
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v
                v = v.substr(v.length - 2)
            }
            return v
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length)
        }
        return all
    })
    return format
}
