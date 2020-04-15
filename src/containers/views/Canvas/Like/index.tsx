import React from 'react'
import { useWorker } from 'react-hooks-worker'
const createWorker = () => new Worker('./like.worker', { type: 'module' })

/**
 * canvas点赞效果
 * @returns
 */
function Link() {
    const { result, error } = useWorker(createWorker, 40)
    console.log(result, 'result')
    return <div>12121</div>
}

export default Link
