/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-06 21:24:02
 * @LastEditTime: 2021-01-07 16:24:01
 * @LastEditors: Please set LastEditors
 */
import axios, { AxiosRequestConfig as _AxiosRequestConfig, Method } from 'axios'
import qs from 'qs'
import { message } from 'antd'

import { userInfo } from '@store/authStore/syncUserInfo'

export interface AxiosRequestConfig extends _AxiosRequestConfig {
    startTime?: Date
}

export interface HttpResquest {
    get?(url: string, data: object, otherConfig?: AxiosRequestConfig, baseUrl?: string): Promise<any>
    post?(url: string, data: object, otherConfig?: AxiosRequestConfig, baseUrl?: string): Promise<any>
    delete?(url: string, data?: object, otherConfig?: AxiosRequestConfig, baseUrl?: string): Promise<any>
    put?(url: string, data: object, otherConfig?: AxiosRequestConfig, baseUrl?: string): Promise<any>
    patch?(url: string, data: object, otherConfig?: AxiosRequestConfig, baseUrl?: string): Promise<any>
}

enum HTTPERROR {
    LOGICERROR,
    TIMEOUTERROR,
    NETWORKERROR
}

const TOKENERROR = [401, 402, 403]

const DEFAULTCONFIG = {
    baseURL: process.env.BASEURL,
}

const http: HttpResquest = {}
// 支持请求方法，简单请求
const methods: Method[] = ['get', 'post', 'put', 'delete', 'patch']

let authTimer: NodeJS.Timer = null

// 判断请求是否成功
const isSuccess = res => (res.code === 200 || res.code === 0)
// 格式化返回结果
const resFormat = res => res.response || res.result || res || {}

methods.forEach(v => {
    http[v] = (url: string, data: object | FormData, otherConfig?: AxiosRequestConfig, baseUrl?: string) => {
        let axiosConfig: AxiosRequestConfig = {
            method: v,
            url,
            baseURL: baseUrl || DEFAULTCONFIG.baseURL,
            headers: { Authorization: `Bearer ${userInfo.token}` }
        }
        const instance = axios.create(DEFAULTCONFIG)
        // 请求拦截
        instance.interceptors.request.use(
            cfg => {
                cfg.params = { ...cfg.params, ts: Date.now() / 1000 }
                return cfg
            },
            error => Promise.reject(error)
        )
        // 响应拦截
        instance.interceptors.response.use(
            response => {
                const rdata = typeof response.data === 'object' && !isNaN(response.data.length) ? response.data[0] : response.data
                if (!isSuccess(rdata)) {
                    return Promise.reject({
                        msg: rdata.msg,
                        errCode: rdata.code,
                        type: HTTPERROR[HTTPERROR.LOGICERROR],
                        config: response.config
                    })
                }
                return resFormat(rdata)
            },
            error => {
                if (TOKENERROR.includes(error.response.status)) {
                    message.destroy()
                    message.error('没有权限，请登录')
                    clearTimeout(authTimer)
                    authTimer = setTimeout(() => {
                        location.replace('/#/login')
                    }, 300)
                    return
                }
                return Promise.reject({
                    msg: error.response.data.error || error.response.statusText || error.message || 'network error',
                    type: /^timeout of/.test(error.message) ? HTTPERROR[HTTPERROR.TIMEOUTERROR] : HTTPERROR[HTTPERROR.NETWORKERROR],
                    config: error.config
                })
            }
        )
        if (v === 'get') {
            axiosConfig.params = data
        } else {
            axiosConfig.data = data
        }
        axiosConfig.startTime = new Date()
        if (otherConfig) {
            axiosConfig = Object.assign(axiosConfig, otherConfig)
        }
        return instance
            .request(axiosConfig)
            .then(res => res)
            .catch(err => {
                message.destroy()
                message.error(err.response || err.msg || err.stack || 'unknown error')
                return Promise.reject(axiosConfig.url.includes('autoScript.set') ? { err } : { err, stack: err.msg || err.stack || '' })
            })
    }
})

export default http
