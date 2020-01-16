import * as React from 'react'
import { Table, Popconfirm, Input, Row, Col, Button, Select } from 'antd'
import { PaginationConfig } from 'antd/lib/pagination'
import { inject, observer } from 'mobx-react'
import { toJS, action, observable, runInAction } from 'mobx'
import { ComponentExt } from '@utils/reactExt'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ParmasOptions } from '@interfaces/params.interfaces'
import FormatDate from '@components/FormatDate'
import useRootStore from '@store/useRootStore'
import * as styles from './index.scss'

const Option = Select.Option

interface IStoreProps {
    getTagList?: (params?: ParmasOptions) => Promise<any>
    tags?: Array<ITagStore.ITag | any>
    loading?: boolean
    paginationObj?: IGlobalStore.PaginationConf
    changePagination?: (pagination: PaginationConfig) => void
    batchDelete?: (ids: string[]) => void
    deleteTagId?: (id: string) => void
}

interface TagProps extends IStoreProps {}

@inject(
    ({ tagStore }: IStore): IStoreProps => {
        const {
            getTagList,
            tags,
            loading,
            paginationObj,
            changePagination,
            batchDelete,
            deleteTagId
        } = useRootStore().tagStore
        return { getTagList, tags, loading, paginationObj, changePagination, batchDelete, deleteTagId }
    }
)
@observer
class TabList extends ComponentExt<TagProps> {
    private searchTerms = new Subject<string>()
    @observable
    private selectedRowKeys: string[] = []
    componentDidMount() {
        this.props.getTagList()
        this.initSub()
    }
    initSub = () => {
        this.searchTerms
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.props.getTagList({ keyword: value })
            })
    }
    @action
    onSelectAllChange = (selectedRowKeys: string[]) => {
        this.selectedRowKeys = selectedRowKeys
    }
    // 批量操作
    @action
    onSelectChange = async (value: string) => {
        if (Object.is(value, 'remove')) {
            await this.props.batchDelete(toJS(this.selectedRowKeys))
            runInAction('BATCH_DELETA_TAG', () => {
                this.selectedRowKeys = []
            })
        }
    }
    // 搜索
    onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.searchTerms.next(e.target.value)
    }
    // 单个删除标签
    deletaTagId = (id: string) => {
        this.props.deleteTagId(id)
    }
    render() {
        const { tags, loading, paginationObj, changePagination } = this.props
        const rowSelection = {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectAllChange
        }
        return (
            <div className={styles.tagList}>
                <h3>标签列表</h3>
                <Row gutter={16} className={styles.tagSearch}>
                    <Col xs={24} sm={8}>
                        <Input placeholder="请输入搜索标签" onChange={this.onSearchChange} />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Select
                            disabled={!this.selectedRowKeys.length}
                            style={{ width: 200 }}
                            placeholder="批量操作"
                            allowClear
                            value={'批量操作'}
                            onChange={this.onSelectChange}
                        >
                            <Option value="remove">批量删除</Option>
                        </Select>
                    </Col>
                </Row>
                <React.Fragment>
                    <Table<ITagStore.ITag>
                        style={{ width: '100%' }}
                        rowKey="_id"
                        loading={loading}
                        dataSource={toJS(tags)}
                        scroll={{ y: 600 }}
                        pagination={{
                            current: paginationObj.current_page,
                            showSizeChanger: false,
                            pageSize: paginationObj.per_page,
                            total: paginationObj.total
                        }}
                        onChange={changePagination}
                        rowSelection={rowSelection}
                    >
                        <Table.Column<ITagStore.ITag> key="name" title="标签名称" dataIndex="name" width={200} />
                        <Table.Column<ITagStore.ITag> key="slug" title="标签别名" dataIndex="slug" width={200} />
                        <Table.Column<ITagStore.ITag>
                            key="description"
                            title="标签描述"
                            dataIndex="description"
                            width={250}
                        />
                        <Table.Column<ITagStore.ITag>
                            key="create_at"
                            title="创建时间"
                            dataIndex="create_at"
                            width={250}
                            render={(_, record) => (
                                <React.Fragment>
                                    <FormatDate date={record.create_at} formatStr="yyyy-MM-dd hh:mm:ss" />
                                </React.Fragment>
                            )}
                        />
                        <Table.Column<ITagStore.ITag> key="enable" title="状态" dataIndex="enable" width={100} />
                        <Table.Column<ITagStore.ITag>
                            key="action"
                            title="操作"
                            dataIndex="action"
                            width={150}
                            render={(_, record) => (
                                <React.Fragment>
                                    <Popconfirm
                                        placement="top"
                                        title="确认删除?"
                                        onConfirm={() => this.deletaTagId(record._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="danger">删除</Button>
                                    </Popconfirm>
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </React.Fragment>
            </div>
        )
    }
}

export default TabList
