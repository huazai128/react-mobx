/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2019-10-30 10:38:11
 * @LastEditors: Please set LastEditors
 */
import { RouterStore } from 'mobx-react-router'

export const routerStore = new RouterStore()

export { default as socketStore } from './socketStore'

export { default as globalStore } from './globalStore'

export { default as authStore } from './authStore'

export { default as userStore } from './userStore'

export { default as tagStore } from './tagStore'

export { default as articleStore } from './articleStore'

export { default as uploadStore } from './uploadStore'

export { default as searchStore } from './searchStore'
