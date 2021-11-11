import autobind from 'autobind-decorator'

export interface IndexModel {
    name: string
    unique?: boolean
}

export interface FindPage {
    page: number
    size: number
    description: IDBCursorDirection
}

export interface FindInfo {
    indexName: string
    indexKind: string
    indexValue: string
    betweenInfo: any
    where: (object: any, cursorIndex: number) => {}
}

export interface OStoresModel<T = any> {
    objectStoreName: string; // 数据库
    index: Array<T> // 数据字段
}

export interface Config {
    dbName?: string
    version?: number
    isDebug?: boolean
    objectStores?: Array<OStoresModel<IndexModel>>;
    objects?: any // 初始化缓存数据
}

@autobind
class IndexDBService {
    private dbName: string = 'test'
    private ver: number = 1
    private iDB: IDBFactory
    private dbRequest: IDBOpenDBRequest
    private isVerChange: boolean = false     // 记录版本是否变更
    private isDebug: boolean = false
    private _db: IDBDatabase
    constructor() {
        this.initDB();
    }
    /**
     * 初始化判断是否支持
     * @private
     * @memberof IndexDBService
     */
    private initDB() {
        this.iDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
        if (!this.iDB) {
            console.log('当前浏览器不支持IndexDB')
        }
    }

    /**
     * 链接db数据库
     * @param {Config} [config={}]
     * @return {*} 
     * @memberof IndexDBService
     */
    public dbOpen(config: Config = {}) {
        const { isDebug, objects, dbName, version, objectStores } = config
        this.isDebug = !!isDebug
        this.dbRequest = this.iDB.open(dbName || this.dbName, version || this.ver)
        if (this.isDebug) {
            console.log('dbRequest - 打开indexedDb数据库：', this.dbRequest)
        }
        // 第一次打开成功后或者版本有变化自动执行以下事件，
        this.dbRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            this.isVerChange = true // 这里标记
            this._db = (e.target as any).result
            if (!!objectStores && !!objectStores.length) {
                // 创建indexedDB数据库的主键和字段
                for (const item of objectStores) {
                    // 验证有没有对象表、没有就创建
                    if (!this._db.objectStoreNames.contains(item.objectStoreName)) {
                        // 创建一个数据库仓库
                        const objectStore = this._db.createObjectStore(item.objectStoreName, {
                            keyPath: 'id',
                            autoIncrement: true // 自动创建主键
                        })
                        // 定义存储对象的数据项字段
                        for (const key of item.index) {
                            objectStore.createIndex(key.name, key.name, {
                                unique: key.unique
                            })
                        }
                        if (this.isDebug) {
                            console.log('onupgradeneeded - 建立了一个新的对象仓库：', objectStore)
                        }
                    }
                }
            }
        }
        return new Promise((resolve, reject) => {
            this.dbRequest.onsuccess = async (e) => {
                this._db = this.dbRequest.result;
                if (this.isVerChange) {
                    await this.setup(objects || {})
                    if (this.isDebug) {
                        console.log('连接成功，存储对象发生变更了')
                    }
                } else {
                    if (this.isDebug) {
                        console.log('连接成功，存储对象没有发生变化')
                    }
                }
                resolve(this._db)
            }
            this.dbRequest.onerror = (e) => {
                reject(e)
                console.log('连接数据库失败')
            }
        })
    }


    /**
     * 初始化数据
     * @param {*} objects
     * @return {*} 
     * @memberof IndexDBService
     */
    private setup(objects: any) {
        const arrStore = Object.keys(objects)
        if (!arrStore.length) return false
        return new Promise((resolve, reject) => {
            if (this.isDebug) {
                console.log('开始新建多个事务', arrStore)
            }
            // 新增多个事务
            const tranRequest = this._db.transaction(arrStore, 'readwrite')
            for (const [key, value] of Object.entries(objects)) {
                const store = tranRequest.objectStore(key)
                // 清空数据
                store.clear().onsuccess = () => {
                    for (const item of (value as any)) {
                        store.add(item).onsuccess = (e) => {
                            if (this.isDebug) {
                                console.log(`添加成功！key:${key}-i:${JSON.stringify(item)}`)
                            }
                        }
                    }
                }
            }
            // 添加成功后统一返回
            tranRequest.oncomplete = (e) => {
                if (this.isDebug) {
                    console.log('setup 执行玩成')
                }
                resolve(e)
            }
            // 添加失败后触发
            tranRequest.onerror = (error) => {
                console.log('添加失败了')
                reject(error)
            }
        })
    }

    /**
     * 添加对象
     * @param {string} storeName
     * @param {object} data
     * @return {*} 
     * @memberof IndexDBService
     */
    public addObject(storeName: string, data: object) {
        return new Promise<void>((resolve, reject) => {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                const _addObject = () => {
                    // 新建一个事务
                    const tranRequest = this._db.transaction(storeName, 'readwrite')
                    // 打开存储对象
                    tranRequest
                        .objectStore(storeName)
                        .add(data) // 添加数据
                        .onsuccess = (e) => {
                            resolve((e.target as any).result) // 返回对象的ID
                        }
                    tranRequest.onerror = (error) => {
                        console.log('addObject 方法添加错误')
                        reject(error)
                    }
                }
                if (!this._db) {
                    this.dbOpen().then(() => {
                        _addObject()
                    })
                } else {
                    _addObject()
                }
            } else {
                reject('parmas必须是对象')
            }
        })
    }

    /**
     * 更新
     * @param {string} storeName
     * @param {{ id: string, [key: string]: any }} data
     * @return {*} 
     * @memberof IndexDBService
     */
    public updateObject(storeName: string, data: { id: number | string, [key: string]: any }) {
        return new Promise<void>((resolve, reject) => {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                const _updateObject = () => {
                    const tranRequest = this._db.transaction(storeName, 'readwrite')
                    // 获取存储对象数据
                    tranRequest
                        .objectStore(storeName) // 获取store
                        .get(data.id)  // 获取对象数据
                        .onsuccess = (e) => {
                            // 更新的数据
                            const newObj = { ...(e.target as any).result, ...data }
                            tranRequest
                                .objectStore(storeName)
                                .put(newObj)
                                .onsuccess = (e) => {
                                    if (this.isDebug) {
                                        console.log('updateObject -- onsuccess- event:', (e.target as any).result, newObj)
                                    }
                                    resolve((e.target as any).result)
                                }
                        }
                    tranRequest.onerror = (error) => {
                        console.log(error, 'error')
                        reject(error)
                    }
                }
                if (!this._db) {
                    this.dbOpen().then(() => {
                        _updateObject()
                    })
                } else {
                    _updateObject()
                }
            } else {
                reject('parmas必须是对象')
            }
        })
    }

    /**
     * 根据ID删除
     * @param {string} storeName
     * @param {(number | string)} id
     * @return {*} 
     * @memberof IndexDBService
     */
    public deleteObject(storeName: string, id: number | string) {
        return new Promise<void>((resolve, reject) => {
            const _deleteObject = () => {
                const tranRequest = this._db.transaction(storeName, 'readwrite')
                tranRequest
                    .objectStore(storeName) // 获取store
                    .delete(id) // 删除一个对象
                    .onsuccess = (event) => { // 成功后的回调
                        if (this.isDebug) {
                            console.log('删除成功：', id)
                        }
                        resolve((event.target as any).result)
                    }
                tranRequest.onerror = (event) => {
                    console.log(event)
                    reject(event)
                }
            }
            if (!this._db) {
                this.dbOpen().then(() => {
                    _deleteObject()
                })
            } else {
                _deleteObject()
            }
        })
    }

    /**
     * 清除store仓库的所有对象
     * @param {string} storeName
     * @return {*} 
     * @memberof IndexDBService
     */
    public clearStore(storeName: string) {
        return new Promise((resolve, reject) => {
            const _clearStore = () => {
                const tranRequest = this._db.transaction(storeName, 'readwrite')
                tranRequest
                    .objectStore(storeName) // 获取store
                    .clear() // 清空对象仓库里的对象
                    .onsuccess = (event) => {
                        resolve(event)
                    }
                tranRequest.onerror = (error) => {
                    console.log(error)
                    reject(error)
                }
            }
            if (!this._db) {
                this.dbOpen().then(() => {
                    _clearStore()
                }).catch((error) => {
                    reject(error)
                })
            } else {
                _clearStore()
            }
        })
    }

    /**
     * 删除数据库
     * @param {string} dbName
     * @return {*} 
     * @memberof IndexDBService
     */
    public deleteDB(dbName: string) {
        return new Promise((resolve, reject) => {
            this.iDB.deleteDatabase(dbName).onsuccess = (event) => {
                resolve(event)
            }
        })
    }

    /**
     * 获取单个或者所有数据对象
     * @param {string} storeName
     * @param {(string | number)} [id]
     * @return {*} 
     * @memberof IndexDBService
     */
    public getObject(storeName: string, id?: string | number) {
        return new Promise((resolve, reject) => {
            const _getObject = () => {
                const tranRequest = this._db.transaction(storeName, 'readonly')
                const store = tranRequest.objectStore(storeName)
                let dbRequest: IDBRequest
                if (!!id) {
                    dbRequest = store.get(id);
                } else {
                    dbRequest = store.getAll();
                }
                dbRequest.onsuccess = (e) => {
                    const data = (e.target as any).result
                    if (this.isDebug) {
                        console.log('获取数据成功', data)
                    }
                    resolve(data)
                }
                tranRequest.onerror = (error) => {
                    console.log(error)
                    reject(error)
                }
            }
            if (!this._db) {
                this.dbOpen().then(() => {
                    _getObject()
                }).catch((error) => {
                    reject(error)
                })
            } else {
                _getObject()
            }
        })
    }

    /**
     * 游标查询或者范围查询
     * @param {string} storeName
     * @param {FindInfo} findInfo
     * findInfo = {
     *   indexName: 'groupId',
     *   indexKind: '=', // '>','>=','<','<=','between',
     *   indexValue: 1,
     *   betweenInfo: {
     *     v1:1,
     *     v2:2,
     *     v1isClose:true,
     *     v2isClose:true,
     *   },
     *   where：(object) => {
     *     reutrn true/false
     *   }
     * }
     * @param {FindPage} [page]
     * page：{
     *   page:开始,
     *   size:数量,
     *   description:'next' 
     *   // next 升序
     *   // prev 降序
     *   // nextunique 升序，只取一
     *   // prevunique 降序，只取一
     * }
     * @return {*} 
     * @memberof IndexDBService
     */
    public findObject(storeName: string, findInfo: FindInfo, page?: FindPage) {
        return new Promise((resolve, reject) => {
            let start = 0, size = 0, end = 0, _description: IDBCursorDirection = 'prev'; // 默认排序
            if (page) {
                start = page.page || 0
                size = page.size || 0
                end = start + size
                _description = page.description || 'prev'
            }
            // 查询条件，按照主键或者索引查询
            let keyRange: any = null;
            if (findInfo.indexName && findInfo.indexKind) {
                const id = findInfo.indexValue
                const dicRange = {
                    "=": IDBKeyRange.only(id),
                    ">": IDBKeyRange.lowerBound(id, true),
                    ">=": IDBKeyRange.lowerBound(id),
                    "<": IDBKeyRange.upperBound(id, true),
                    "<=": IDBKeyRange.upperBound(id)
                }
                switch (findInfo.indexKind) {
                    case '=':
                    case '>':
                    case '>=':
                    case '<':
                    case '<=':
                        keyRange = dicRange[findInfo.indexKind]
                        break
                    case 'between':
                        const betweenInfo = findInfo.betweenInfo
                        keyRange = IDBKeyRange.bound(betweenInfo.v1, betweenInfo.v2, betweenInfo.v1isClose, betweenInfo.v2isClose)
                        break
                }
            }
            console.log('findObject - keyRange', keyRange)
            const _findObjectByIndex = () => {
                const dataList = []
                let cursorIndex = 0
                const tranRequest = this._db.transaction(storeName, 'readonly')
                const store = tranRequest.objectStore(storeName)
                let cursorRequest
                // 判断是否索引查询
                if (typeof findInfo.indexName === "undefined") {
                    cursorRequest = store.openCursor(keyRange, _description)
                } else {
                    cursorRequest = store
                        .index(findInfo.indexName)
                        .openCursor(keyRange, _description)
                }
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    // 判断游标是否存在
                    if (cursor) {
                        if (end === 0 || (cursorIndex >= start && cursorIndex < end)) {
                            // 判断钩子函数
                            if (typeof findInfo.where === 'function') {
                                if (findInfo.where(cursor.value, cursorIndex)) {
                                    dataList.push(cursor.value)
                                    cursorIndex++
                                }
                            } else { // 没有设置查询条件
                                dataList.push(cursor.value)
                                cursorIndex++
                            }
                        }
                        // 存在继续遍历游标
                        cursor.continue()
                    }
                }
                tranRequest.oncomplete = (event) => {
                    if (this.isDebug) {
                        console.log('findObjectByIndex - dataList', dataList)
                    }
                    resolve(dataList)
                }
                tranRequest.onerror = (event) => {
                    console.log('findObjectByIndex - onerror', event)
                    reject(event)
                }
            }
            // 判断数据库是否打开
            if (!this._db) {
                this.dbOpen().then(() => {
                    _findObjectByIndex()
                })
            } else {
                _findObjectByIndex()
            }
        })
    }
}

const db = new IndexDBService()

export default db