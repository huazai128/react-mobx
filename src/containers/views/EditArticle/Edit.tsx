import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import BraftEditor from 'braft-editor'
import { toJS } from 'mobx'
import { MediaType, EditorState } from 'braft-editor'
import 'braft-editor/dist/index.css'
import { Form, Upload, Button, Input, Select, Radio, Icon, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IUploadState } from '@interfaces/upload.interface'
import { action, observable, runInAction } from 'mobx'
import { IArticle } from '@interfaces/article.interface'
import { getUrlParams } from '@utils/urlUtils'
import useRootStore from '@store/useRootStore'

const { Option } = Select
const { TextArea } = Input

interface EditProps extends IUploadState {
    saveArticle?: (parma: IArticle) => any
    getTagList?: () => void
    tags?: Array<ITagStore.ITag | any>
    getArticleId?: (id: string) => void
    article?: IArticleStore.IArticle
}

@inject(
    (store: IStore): EditProps => {
        const { saveArticle, getArticleId, article } = useRootStore().articleStore
        const { getTagList, tags } = useRootStore().tagStore
        const {
            name,
            getToken,
            beforeUpload,
            changeFile,
            uploadUrl,
            data,
            uploadFn,
            thumb
        } = useRootStore().uploadStore
        return {
            name,
            getToken,
            beforeUpload,
            changeFile,
            uploadUrl,
            data,
            uploadFn,
            thumb,
            saveArticle,
            getTagList,
            tags,
            getArticleId,
            article
        }
    }
)
@observer
class Edit extends Component<EditProps & FormComponentProps> {
    get articleId() {
        return getUrlParams('id', '')
    }
    @observable content: EditorState = BraftEditor.createEditorState(null)
    async componentDidMount() {
        this.props.getToken()
        await this.props.getTagList()
        if (this.articleId) {
            await this.props.getArticleId(this.articleId)
            const { article } = this.props
            const tags = article.tags.map(item => item._id)
            const lists = [
                {
                    uid: '-1',
                    status: 'done',
                    url: article.thumb
                }
            ]
            this.getCotent(article.content)
            this.props.form.setFieldsValue({
                title: article.title,
                keywords: article.keywords.toString(),
                tags: tags,
                state: article.state,
                public: article.public,
                description: article.description,
                thumb: lists
            })
        }
    }

    @action
    getCotent(content: string) {
        this.content = BraftEditor.createEditorState(content)
    }

    // 提交表单
    handleSubmit = e => {
        e.preventDefault()
        const { form, thumb, saveArticle } = this.props
        form.validateFields((err, values) => {
            const content = this.content.toHTML()
            if (!content) {
                message.error('请输入文章内容')
                return null
            }
            if ((!values.thumb || !values.thumb[0].url) && !thumb) {
                message.error('请上传缩略图')
                return null
            }
            if (!err) {
                values.content = content
                values.keywords = values.keywords.split(',')
                values.thumb = thumb || values.thumb[0].url
                saveArticle(values)
            }
        })
    }

    @action
    changeBraftEditor = editorState => {
        runInAction('SET_CONTENT', () => {
            this.content = editorState
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { name, beforeUpload, changeFile, uploadUrl, data, uploadFn, tags } = this.props
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 }
        }
        const formContentLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }
        const mediaObj: MediaType = {
            uploadFn: uploadFn,
            validateFn: file => {
                return new Promise((resolve, reject) => {
                    if (file.size < 1024 * 1024 * 2) {
                        beforeUpload(file)
                        resolve()
                    } else {
                        reject()
                    }
                })
            },
            onChange: e => {}
        }
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="标题">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: '请输入文章标题',
                                max: 50,
                                min: 3
                            }
                        ]
                    })(<Input placeholder="请输入文章标题" />)}
                </Form.Item>
                <Form.Item label="关键字">
                    {getFieldDecorator('keywords', {
                        rules: [
                            {
                                required: true,
                                message: '请输入关键字'
                            }
                        ]
                    })(<Input placeholder="请输入关键字" />)}
                </Form.Item>
                <Form.Item label="文章标签">
                    {getFieldDecorator('tags', {
                        rules: [{ required: true, message: '请选择文章相关标签', type: 'array' }]
                    })(
                        <Select mode="multiple" placeholder="请选择标签">
                            {tags.map((item, index) => (
                                <Option key={index} value={item._id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="发布状态">
                    {getFieldDecorator('state', {
                        initialValue: 1
                    })(
                        <Radio.Group>
                            <Radio value={1}>已发布</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={-1}>回收站</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="公开状态">
                    {getFieldDecorator('public', {
                        initialValue: 1
                    })(
                        <Radio.Group>
                            <Radio value={1}>公开状态</Radio>
                            <Radio value={0}>需要密码</Radio>
                            <Radio value={-1}>私密</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label="文章描述">
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入文章描述' }]
                    })(<TextArea placeholder="请输入文章描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </Form.Item>
                <Form.Item label="文章缩略图">
                    {getFieldDecorator('thumb', {
                        valuePropName: 'fileList',
                        getValueFromEvent: e => {
                            if (Array.isArray(e)) {
                                return e
                            }
                            return e && e.fileList
                        }
                    })(
                        <Upload
                            name={name}
                            action={uploadUrl}
                            onChange={changeFile}
                            beforeUpload={beforeUpload}
                            listType="picture"
                            data={data}
                            headers={{
                                accessControlAllowOrigin: uploadUrl
                            }}
                        >
                            <Button>
                                <Icon type="upload" /> 上传图片
                            </Button>
                        </Upload>
                    )}
                </Form.Item>
                <Form.Item {...formContentLayout} label="文章内容">
                    <BraftEditor value={toJS(this.content)} onChange={this.changeBraftEditor} media={mediaObj} />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                    <Button type="primary" htmlType="submit">
                        确认
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({ name: 'edit-article' })(Edit)
