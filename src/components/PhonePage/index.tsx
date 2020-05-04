import * as React from 'react'
import './style.less'
interface PhonePageProps {
    children: React.ReactNode
    className?: string
}

function PhonePage({ children, className = '' }: PhonePageProps) {
    return <div className={`phone-page ${className}`}>{children}</div>
}

export default PhonePage
