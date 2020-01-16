import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Form, Icon, Input, Button, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import useRootStore from '@store/useRootStore'

import * as styles from './index.scss'

const FormItem = Form.Item

interface TagProps {
    addTag?: (data: ITagStore.TagParams) => Promise<any>
}

function AddTag({ form, addTag }: TagProps & FormComponentProps) {
    const { tagStore } = useRootStore()
    const [loading, setLoading] = useState(false)
    // 提交表单
    const handleSubmit = (e: React.FormEvent<any>): void => {
        e.preventDefault()
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    setLoading(true)
                    try {
                        await tagStore.addTag(values)
                        form.resetFields()
                    } catch (error) {}
                    setLoading(false)
                } else {
                    message.error('请输入表单')
                    form.resetFields()
                }
            }
        )
    }
    const { getFieldDecorator } = form
    const formItemLayout = {
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 22 }
        }
    }
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 12,
                offset: 4
            }
        }
    }
    return (
        <div className={styles.addTag}>
            <h3>编辑标签</h3>
            <Form {...formItemLayout} onSubmit={handleSubmit}>
                <FormItem hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入标签!' }]
                    })(
                        <Input
                            prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                            placeholder="标签名称"
                        />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('slug', {
                        rules: [{ required: true, message: '请输入标签别名!' }]
                    })(
                        <Input
                            prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                            placeholder="标签别名"
                        />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入标签描述!' }]
                    })(
                        <Input
                            prefix={<Icon type="tags" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                            placeholder="标签描述"
                        />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        新增标签
                    </Button>
                </FormItem>
            </Form>
        </div>
    )
}

export default Form.create({ name: 'edit-tag' })(observer(AddTag))
