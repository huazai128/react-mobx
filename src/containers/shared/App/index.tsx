import React from 'react'
import Loadable from 'react-loadable'
import { HashRouter, Router, Switch, Route } from 'react-router-dom'
import { createHashHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import styles from './index.scss'
import * as store from '@store/index'
import PageLoading from '@components/PageLoading'
import Error from '@components/Error'
import Provider from './Provider'
import IntlWrapper from './IntlWrapper'
import PrivateRoute from '@shared/PrivateRoute'
import { routes, asynchronousComponents } from '@views/Home/menu'

const hashHistory = createHashHistory()
const history = syncHistoryWithStore(hashHistory, store.routerStore)

const Home = Loadable({
    loader: () => import(/* webpackChunkName: "home" */ '@views/Home'),
    loading: PageLoading
})
const Login = Loadable({
    loader: () => import(/* webpackChunkName: "login" */ '@views/Login'),
    loading: PageLoading
})

const AppWrapper = ({ children }: { children?: React.ReactNode }) => <div className={styles.appWrapper}>{children}</div>

function App() {
    return (
        <Provider>
            <IntlWrapper>
                <AppWrapper>
                    <Router history={history}>
                        <HashRouter>
                            <Switch>
                                <Route exact path="/login" component={Login} />
                                {routes.map(m => {
                                    return (
                                        <Route
                                            key={m.id}
                                            exact={m.exact}
                                            path={m.path}
                                            component={m.component ? asynchronousComponents[m.component] : null}
                                        />
                                    )
                                })}
                                <PrivateRoute path="/" component={Home} />
                                <Route component={Error} />
                            </Switch>
                        </HashRouter>
                    </Router>
                </AppWrapper>
            </IntlWrapper>
        </Provider>
    )
}

export default App
