import * as React from 'react'
import { formatDate } from '@utils/format'
import { FormatDateOpt } from '@interfaces/format.interface'

/**
 * 格式化日期组件
 * @param {Date} date
 * @param {string} [formatStr]
 * @returns {JSX.Element}
 */
const FormatDate = ({ date, formatStr }: FormatDateOpt): JSX.Element => {
    return <>{formatDate(new Date(new Date(date).getTime()), formatStr)}</>
}

export default FormatDate
