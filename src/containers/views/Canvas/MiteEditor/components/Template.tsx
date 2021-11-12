import React, { useState, useEffect } from 'react'
import PubSub from 'pubsub-js'

const Template = () => {
    const [tpls, setTpls] = useState<any>(() => {
        const tpls = JSON.parse(localStorage.getItem('tpls') || "{}")
        return Object.keys(tpls).map(item => ({ t: tpls[item].t, id: item }))
    });
    useEffect(() => {
        PubSub.subscribe('saveSuccess', (msg, data) => {
            setTpls((prev: any) => [...prev, data])
        })
    }, [])

    const renderJson = (id: string) => {
        const tpls = JSON.parse(localStorage.getItem('tpls') || "{}")
        const json = tpls[id].json;
        PubSub.publish('renderJson', json)
    }
    return (
        <section className="me-template">
            <div className="simpleTit">模版素材</div>
            <div className="tpls">
                {
                    tpls.map((item: { id: string, t: string }, i: number) => {
                        return <div key={i} className="tplItem" onClick={() => renderJson(item.id)}>
                            <img src={JSON.parse(localStorage.getItem('tplImgs') || "{}")[item.id]} alt="" />
                            <div>{item.t}</div>
                        </div>
                    })
                }
            </div>
        </section >
    )
}

export default Template