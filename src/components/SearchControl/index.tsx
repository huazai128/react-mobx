import React, { useMemo, useState, useCallback } from 'react'
import moment from 'moment'
import { observer } from 'mobx-react'
import useRootStore from '@store/useRootStore'
import { useObservableState } from 'observable-hooks'
import { useOnUnmount, useOnMount } from '@utils/hooks'
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators'
import { Button, Row, Col, Input, Select, DatePicker, Icon } from 'antd'
import { RangePickerValue } from 'antd/es/date-picker/interface'
import { CONTROLLER_OPT } from '@interfaces/params.interfaces'
const { RangePicker } = DatePicker
const { Search } = Input
const Option = Select.Option

let oldCall,
    clearOptions,
    onCall,
    selectOptions = null

/**
 * 控制粒度可以细化，减小useState或者mobx变化重新渲染
 * @returns {JSX.Element}
 */
function ScearchControl(): JSX.Element {
    const {
        clearSreachObj,
        getSreachObj,
        options,
        isControll,
        allowControll,
        handleOperat,
        controOpts
    } = useRootStore().searchStore
    const { getTagList, tags } = useRootStore().tagStore
    const [_, updateKeyword] = useObservableState(transformKeyword, '')
    const [tagIds, setTagIds] = useState([])
    const initData = () => {
        getTagList()
    }
    function transformKeyword(event$) {
        return event$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((value: string) => {
                getSreachObj({ keyword: value })
            })
        )
    }
    // 当前state或者props变化时，会重新生产新的getTags函数；此时要配合useMemo、useCallback；但是会有性能消耗
    const testCallback = useCallback(
        value => {
            getSreachObj({ tags: value })
            setTagIds(value)
        },
        [tagIds]
    )
    selectOptions = (value: CONTROLLER_OPT) => {
        handleOperat(value)
        allowControll(false)
    }
    clearOptions = useCallback(() => {
        clearSreachObj()
        setTagIds([])
    }, [])
    const unmount = () => {
        clearSreachObj()
    }
    // 对比使用useCallback、state或者props改变时，前后对比。这样判断是否重新渲染
    console.log(onCall === selectOptions, 'selectOptions', oldCall === clearOptions)
    oldCall = clearOptions
    onCall = selectOptions
    const dateFormat = 'YYYY/MM/DD'
    const date: Array<any> =
        options.date && !!options.date.length
            ? [moment(options.date[0], dateFormat) || '', moment(options.date[1], dateFormat) || '']
            : []
    useOnMount(initData)
    useOnUnmount(unmount)
    return (
        <div className="control-box">
            <Row gutter={16}>
                <Col xs={18} sm={12} md={6}>
                    <Search placeholder="请输入搜索关键字" onChange={e => updateKeyword(e.target.value)} />
                </Col>
                <Col xs={18} sm={12} md={6}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="根据标签查询"
                        allowClear
                        value={tagIds || []}
                        onChange={testCallback}
                    >
                        {tags.map((item, index) => (
                            <Option key={item._id} value={item._id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={18} sm={12} md={6}>
                    <RangePicker
                        style={{ width: '95%' }}
                        format={dateFormat}
                        placeholder={['开始日期', '结束日期']}
                        value={date}
                        onChange={(value: RangePickerValue, dateString: Array<string>) => {
                            getSreachObj({ date: dateString })
                        }}
                    />
                </Col>
                <Col xs={18} sm={12} md={6}>
                    <Select
                        disabled={!isControll}
                        style={{ width: '100%' }}
                        placeholder="批量操作"
                        allowClear
                        value={controOpts || undefined}
                        onChange={selectOptions}
                    >
                        <Option value="-2">批量删除</Option>
                        <Option value="1">批量发布</Option>
                        <Option value="-1">回收站</Option>
                    </Select>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={18} sm={18} md={12}>
                    <Button>
                        <Icon type="sync" />
                        刷新
                    </Button>
                    <Button>
                        <Icon type="export" />
                        导出数据
                    </Button>
                    <Button onClick={clearOptions}>
                        <Icon type="delete" />
                        清空搜索条件
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default observer(ScearchControl)
