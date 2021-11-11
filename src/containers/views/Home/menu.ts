/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2021-05-06 11:39:52
 * @LastEditors: Please set LastEditors
 */
import Loadable from 'react-loadable'
import PageLoading from '@components/PageLoading'

const loadComponent = (loader: () => Promise<any>) => Loadable({ loader, loading: PageLoading })

export const asynchronousComponents = {
    Tags: loadComponent(() => import(/* webpackChunkName: "tags" */ '@views/Tags')),
    Article: loadComponent(() => import(/* webpackChunkName: "article" */ '@views/Article')),
    EditArticle: loadComponent(() => import(/* webpackChunkName: "addArticle" */ '@views/EditArticle')),
    Like: loadComponent(() => import(/* webpackChunkName: "like" */ '@views/Canvas/Like')),
    Card: loadComponent(() => import(/* webpackChunkName: "card" */ '@views/Canvas/Card')),
    Map: loadComponent(() => import(/* webpackChunkName: "card" */ '@views/Canvas/Map')),
    Rtmp: loadComponent(() => import(/* webpackChunkName: "rtmp" */ '@views/LiveVideo/Rtmp')),
    Broadway: loadComponent(() => import(/* webpackChunkName: "broadway" */ '@views/LiveVideo/Broadway')),
    Yuv: loadComponent(() => import(/* webpackChunkName: "broadway" */ '@views/LiveVideo/Yuv')),
    Users: loadComponent(() => import(/* webpackChunkName: "users" */ '@views/Users')),
    Upload: loadComponent(() => import(/* webpackChunkName: "Upload" */ '@views/JS/Upload')),
    IndexDB: loadComponent(() => import(/* webpackChunkName: "IndexDB" */ '@views/JS/IndexDB')),
    Sticky: loadComponent(() => import(/* webpackChunkName: "Sticky" */ '@views/CSS/Sticky/index')),
    SendBox: loadComponent(() => import(/* webpackChunkName: "SendBox" */ '@views/CSS/SendBox/index')),
    MiteEditor: loadComponent(() => import(/* webpackChunkName: "MiteEditor" */ '@views/Canvas/MiteEditor/index')),
}

// all routers key
export type AsynchronousComponentKeys = keyof typeof asynchronousComponents

export interface IMenu {
    title: string
    id?: number
    pid?: number
    path?: string
    icon?: string
    component?: AsynchronousComponentKeys
    exact?: boolean
    isHide?: boolean
}

export interface IMenuInTree extends IMenu {
    children?: IMenuInTree[]
}
export const routes: IMenu[] = [
    {
        id: 61,
        path: '/sticky',
        title: 'Position Sticky',
        icon: 'book',
        component: 'Sticky',
        exact: true,
        isHide: true
    },
]

export const menu: IMenu[] = [
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
        component: 'Like',
        exact: true
    },
    {
        pid: 3,
        id: 30,
        path: '/like',
        title: '点赞动画',
        icon: 'book',
        component: 'Like',
        exact: true
    },
    {
        pid: 3,
        id: 31,
        path: '/card',
        title: '通用画卡',
        icon: 'book',
        component: 'Card',
        exact: true
    },
    {
        pid: 3,
        id: 32,
        path: '/map',
        title: 'Canvas缩放放大',
        icon: 'book',
        component: 'Map',
        exact: true
    },
    {
        pid: 3,
        id: 33,
        path: '/editor',
        title: '画卡',
        icon: 'book',
        component: 'MiteEditor',
        exact: true
    },
    {
        id: 4,
        path: '/live',
        title: '直播',
        icon: 'book',
        component: 'Rtmp',
        exact: true
    },
    {
        pid: 4,
        id: 41,
        path: '/rtmp',
        title: 'RTMP直播',
        icon: 'book',
        component: 'Rtmp',
        exact: true
    },
    {
        pid: 4,
        id: 42,
        path: '/broadway',
        title: 'Broadway直播',
        icon: 'book',
        component: 'Broadway',
        exact: true
    },
    {
        pid: 4,
        id: 43,
        path: '/yuv',
        title: 'Yuv直播',
        icon: 'book',
        component: 'Yuv',
        exact: true
    },
    {
        id: 5,
        path: '/js',
        title: 'JS插件',
        icon: 'book',
        exact: true
    },
    {
        pid: 5,
        id: 51,
        path: '/upload',
        title: '上传',
        icon: 'upload',
        component: 'Upload',
        exact: true
    },
    {
        id: 52,
        pid: 5,
        path: '/indexdb',
        title: 'IndexDB',
        icon: 'book',
        component: 'IndexDB',
        exact: true
    },
    {
        id: 6,
        path: '/css',
        title: 'CSS相关',
        icon: 'book',
        exact: true
    },
    {
        id: 61,
        pid: 6,
        path: '/sticky',
        title: 'Position Sticky',
        isHide: true
    },
    {
        id: 62,
        pid: 6,
        path: '/sendbox',
        title: 'svg和动画',
        component: 'SendBox',
        exact: true
    },
    {
        id: 9,
        path: '/users',
        title: '用户管理',
        icon: 'user',
        component: 'Users',
        exact: true
    }
]

export default menu
