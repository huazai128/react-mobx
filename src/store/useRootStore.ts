/*
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2020-03-26 16:21:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /react-mobx1/src/store/useRootStore.ts
 */
import { useContext } from 'react'

import { RootContext } from '@shared/App/Provider'

export default function useRootStore() {
    return useContext(RootContext)
}
