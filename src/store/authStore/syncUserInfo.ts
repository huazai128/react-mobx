/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2019-10-24 14:32:14
 * @LastEditors: Please set LastEditors
 */
import { LOCALSTORAGE_KEYS } from '@constants/index'

export const initialUserInfo = (() => {
    const localUserInfo = localStorage.getItem(LOCALSTORAGE_KEYS.USERINFO)
    const _userInfo: IAuthStore.UserInfo = !!JSON.parse(localUserInfo) ? JSON.parse(localUserInfo) : {}
    return _userInfo
})()

export let userInfo: IAuthStore.UserInfo = initialUserInfo

/**
 * syncUserInfo for http
 *
 * @export
 * @param {IAuthStore.UserInfo} data
 */
export function syncUserInfo(data: IAuthStore.UserInfo) {
    userInfo = data
}
