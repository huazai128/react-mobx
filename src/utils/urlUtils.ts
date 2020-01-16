/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-25 16:29:40
 * @LastEditTime: 2019-10-25 16:37:20
 * @LastEditors: Please set LastEditors
 */
/**
 * 获取url参数
 * @export
 * @param {string} name
 * @param {*} [search]
 * @returns
 */
export function getUrlParams(name: string, href?: any) {
    href = (href || window.location.href).match(/\?.*(?=\b|#)/)
    href && (href = href[0].replace(/^\?/, ''))
    if (!href) return name ? '' : {}
    let queries = {},
        params = href.split('&')

    for (let i in params) {
        const param = params[i].split('=')
        queries[param[0]] = param[1] ? decodeURIComponent(param[1]) : ''
    }
    return name ? queries[name] : queries
}
