import React, { Component, Fragment } from 'react'
import { Radio, Tooltip } from "antd";
import useRootStore from '@store/useRootStore'
import { observer } from 'mobx-react'

interface IProps {
}

const DisignScene: React.FC<IProps> = observer(({ }: IProps) => {
    const { tabChangeHandle, curDisignId, pList } = useRootStore().wasmStore
    return <div className="ds-side-tab">
        {pList.map((item) => (
            <Tooltip key={item.id} title={item.title} placement="right" overlayClassName="desigin-tootip">
                <Radio.Button
                    checked={item.id == curDisignId}
                    className="tab"
                    onClick={() => tabChangeHandle(item.id)}
                >
                    {
                        item.id === curDisignId ? (
                            <div className="icon" style={{ backgroundImage: `url(${item.iconHighlightUrl || item.iconUrl})` }}></div>
                        ) : (
                            <div className="icon" style={{ backgroundImage: `url(${item.iconUrl})` }}></div>
                        )
                    }
                </Radio.Button>
            </Tooltip>
        ))}
    </div>
})

export default DisignScene