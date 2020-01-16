import React, { Fragment, useState, useEffect, useMemo, useCallback } from 'react'
import { observer } from 'mobx-react'
import useRootStore from '@store/useRootStore'
import { Table, Popconfirm, Button } from 'antd'
import FormatDate from '@components/FormatDate'
import { CONTROLLER_OPT } from '@interfaces/params.interfaces'

interface ActicleTableProps {
    scrollY: number
}

function ActicleTable({ scrollY }: ActicleTableProps) {
    const { replace } = useRootStore().routerStore
    const { getArticleList, articles, loading, paginationObj, batchUpdate, batchDelete } = useRootStore().articleStore
    const { options, allowControll, controOpts, handleOperat } = useRootStore().searchStore
    const [ids, setIds] = useState([])
    useEffect(() => {
        getArticleList(options)
    }, [options])
    const onSelectAllChange = useCallback(
        (value: string[]) => {
            allowControll(!!value.length)
            setIds(value)
        },
        [ids]
    )
    const newSelectId = useMemo(() => {
        // 发布 或者回收站
        if (Object.is(controOpts, CONTROLLER_OPT.UPDATE) || Object.is(controOpts, CONTROLLER_OPT.RECYCLE)) {
            batchUpdate({ ids: ids, state: controOpts })
        }
        if (Object.is(controOpts, CONTROLLER_OPT.REMOVE)) {
            batchDelete({ ids: ids })
        }
        setTimeout(() => {
            handleOperat(CONTROLLER_OPT.NORMAL)
        }, 300)
        setIds([])
    }, [controOpts])
    return (
        <Fragment>
            <Table<IArticleStore.IArticle>
                scroll={{ y: scrollY }}
                loading={loading}
                dataSource={articles}
                pagination={{
                    current: paginationObj.current_page,
                    showSizeChanger: false,
                    pageSize: paginationObj.per_page,
                    total: paginationObj.total
                }}
                rowSelection={{
                    selectedRowKeys: ids,
                    onChange: onSelectAllChange
                }}
                style={{ width: '100%' }}
                rowKey="_id"
            >
                <Table.Column key="name" title="文章标题" dataIndex="title" width={150} />
                <Table.Column<IArticleStore.IArticle>
                    key="t_content"
                    title="文章内容"
                    dataIndex="t_content"
                    width={200}
                    render={(_, record) => (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: record.t_content
                            }}
                        ></div>
                    )}
                />
                <Table.Column<IArticleStore.IArticle>
                    key="thumb"
                    title="缩略图"
                    dataIndex="thumb"
                    width={150}
                    render={(_, record) => <img style={{ width: '80px', height: '80px' }} src={record.thumb} alt="" />}
                />
                <Table.Column<IArticleStore.IArticle>
                    key="create_at"
                    title="创建时间"
                    dataIndex="create_at"
                    width={200}
                    render={(_, record) => (
                        <React.Fragment>
                            <FormatDate date={record.create_at} formatStr="yyyy-MM-dd hh:mm:ss" />
                        </React.Fragment>
                    )}
                />
                <Table.Column<IArticleStore.IArticle>
                    key="state"
                    title="发布状态"
                    width={120}
                    dataIndex="state"
                    render={(_, record) => (
                        <React.Fragment>
                            {record.state == 0 ? '草稿' : record.state == -1 ? '回收站' : '已发布'}
                        </React.Fragment>
                    )}
                />
                <Table.Column<IArticleStore.IArticle>
                    key="public"
                    width={120}
                    title="公开状态"
                    dataIndex="public"
                    render={(_, record) => (
                        <React.Fragment>
                            {record.public == 0 ? '需要密码' : record.public == -1 ? '私密' : '公开状态'}
                        </React.Fragment>
                    )}
                />
                <Table.Column<IArticleStore.IArticle>
                    key="meta"
                    title="元数据"
                    width={200}
                    dataIndex="meta"
                    render={(_, record) => (
                        <React.Fragment>
                            <p>喜欢量：{record.meta.likes}</p>
                            <p>访问量：{record.meta.views}</p>
                            <p>评论量：{record.meta.comments}</p>
                        </React.Fragment>
                    )}
                />
                <Table.Column<IArticleStore.IArticle>
                    key="action"
                    title="操作"
                    dataIndex="action"
                    width={150}
                    render={(_, record) => (
                        <React.Fragment>
                            <Button type="primary" onClick={() => replace(`/article/edit?id=${record._id}`)}>
                                编辑
                            </Button>
                            <Popconfirm
                                placement="top"
                                title="确认删除?"
                                onConfirm={() => {
                                    console.log('1212')
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </React.Fragment>
                    )}
                />
            </Table>
        </Fragment>
    )
}

export default observer(ActicleTable)
