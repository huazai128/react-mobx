import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import db from './db'
import './style.scss'


interface IProps { }

const IndexDB: React.FC<IProps> = ({ }: IProps) => {
    useEffect(() => {
        db.dbOpen({
            isDebug: true,
            version: 1,
            dbName: 'dto',
            objectStores: [ // 建库依据
                {
                    objectStoreName: 'blog',
                    index: [ // 索引 ， unique 是否可以重复
                        { name: 'groupId', unique: false },
                        { name: 'id', unique: true },
                        // { name: 'title', unique: false },
                        // { name: 'addTime', unique: false },
                        // { name: 'introduction', unique: false },
                        // { name: 'concent', unique: false },
                        // { name: 'viewCount', unique: false },
                        // { name: 'agreeCount', unique: false },
                    ]
                }
            ],
            objects: { // 初始化数据，
                blog: [
                    {
                        id: 1,
                        groupId: 1,
                        title: '这是一个博客',
                        addTime: '2020-10-15',
                        introduction: '这是博客简介',
                        concent: '这是博客的详细内容<br>第二行',
                        viewCount: 1,
                        agreeCount: 1
                    },
                    {
                        id: 2,
                        groupId: 2,
                        title: '这是两个博客',
                        addTime: '2020-10-15',
                        introduction: '这是博客简介',
                        concent: '这是博客的详细内容<br>第二行',
                        viewCount: 10,
                        agreeCount: 10
                    }
                ]
            }
        }).then(() => {
            console.log(db.getObject('blog'))
            db.deleteObject('blog', 2)
        })
    }, [])
    return (
        <div>IndexDB</div>
    )
}

export default observer(IndexDB)
