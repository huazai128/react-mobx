/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 13:58:35
 * @LastEditTime: 2019-10-29 19:33:25
 * @LastEditors: Please set LastEditors
 */
import { RouterStore as _RouterStore } from 'mobx-react-router'

declare global {
    /**
     * type from mobx-react-router
     *
     * @interface RouterStore
     * @extends {_RouterStore}
     */
    interface RouterStore extends _RouterStore {}

    /**
     * type for all store
     *
     * @interface IStore
     */
    interface IStore {
        globalStore: IGlobalStore.GlobalStore
        socketStore: ISocketStore.SocketStore
        uploadStore: IUploadStore.UploadStore
        authStore: IAuthStore.AuthStore
        userStore: IUserStore.UserStore
        tagStore: ITagStore.TagStore
        articleStore: IArticleStore.ArticleStore
        searchStore: ISearchStore.SearchStore
        routerStore: RouterStore
    }
}
