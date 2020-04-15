/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2020-04-14 18:11:18
 * @LastEditors: Please set LastEditors
 */
import Loadable from 'react-loadable'

import PageLoading from '@components/PageLoading'

const loadComponent = (loader: () => Promise<any>) => Loadable({ loader, loading: PageLoading })

export const asynchronousComponents = {
    Tags: loadComponent(() => import(/* webpackChunkName: "tags" */ '@views/Tags')),
    Article: loadComponent(() => import(/* webpackChunkName: "article" */ '@views/Article')),
    EditArticle: loadComponent(() => import(/* webpackChunkName: "addArticle" */ '@views/EditArticle')),
    SocketDebugger: loadComponent(() => import(/* webpackChunkName: "socket-debugger" */ '@views/SocketDebugger')),
    Canvas: loadComponent(() => import(/* webpackChunkName: "like" */ '@views/Canvas/Like')),
    Users: loadComponent(() => import(/* webpackChunkName: "users" */ '@views/Users'))
}

// all routers key
export type AsynchronousComponentKeys = keyof typeof asynchronousComponents

export interface IMenu {
    title: string
    id: number
    pid?: number
    path?: string
    icon?: string
    component?: AsynchronousComponentKeys
    exact?: boolean
}

export interface IMenuInTree extends IMenu {
    children?: IMenuInTree[]
}

export const menu: IMenu[] = [
    // {
    //     id: 1,
    //     path: '/',
    //     title: '控制面板',
    //     icon: 'dashboard',
    //     component: 'Dashboard',
    //     exact: true
    // },
    {
        id: 1,
        path: '/article',
        title: '文章管理',
        icon: 'book',
        component: 'Article',
        exact: true
    },
    {
        pid: 1,
        id: 10,
        path: '/article/list',
        title: '文章列表',
        icon: 'book',
        component: 'Article',
        exact: true
    },
    {
        pid: 1,
        id: 11,
        path: '/article/edit',
        title: '编辑文章',
        icon: 'edit',
        component: 'EditArticle',
        exact: true
    },
    {
        id: 2,
        path: '/tags',
        title: '标签管理',
        icon: 'tag',
        component: 'Tags',
        exact: true
    },
    {
        id: 3,
        path: '/canvas',
        title: 'Canvas相关知识',
        icon: 'book',
        component: 'Canvas',
        exact: true
    },
    {
        id: 4,
        path: '/users',
        title: '用户管理',
        icon: 'user',
        component: 'Users',
        exact: true
    }
]

export default menu
