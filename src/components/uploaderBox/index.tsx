import { View } from '@tarojs/components'
import { defineComponent } from 'vue'
import { Uploader } from '@nutui/nutui-taro'
import { createHeader, baseURL } from '@/utils/request'
import './index.scss'
import { Toast } from '@/utils/utils'

const PublicURL = `${baseURL}/msapi/E6-MS-TMS-SUPPORT-WEB`
// const AuthURL = `${PublicURL}/cloudStorage/file/batchAuthUrl`
const UploaderURL = `${PublicURL}/api/upload/fildUploadPublicByInputStream`

// TODO 需要服务端返回真实路径，否则无法实现图片回填
export default defineComponent({
	name: 'uploaderBox',
	props: {
		target: {
			type: Object,
			default: () => {
				return {
					key: 'e6yun3.0',
					bizKey: 'waybillPlatform',
				}
			},
		},
		containerClass: String,
		name: { type: String, default: 'files' },
		url: { type: String, default: UploaderURL },
		sizeType: {
			type: Array,
			default: () => ['original', 'compressed'],
		},
		sourceType: {
			type: Array,
			default: () => ['album', 'camera'],
		},
		mediaType: {
			type: Array,
			default: () => ['image', 'video', 'mix'],
		},
		camera: {
			type: String,
			default: 'back',
		},
		timeout: { type: [Number, String], default: 1e3 * 30 },
		fileList: { type: Array, default: () => [] },
		isPreview: { type: Boolean, default: true },
		// picture、list
		listType: { type: String, default: 'picture' },
		isDeletable: { type: Boolean, default: true },
		method: { type: String, default: 'get' },
		capture: { type: Boolean, default: false },
		maximize: { type: [Number, String], default: Number.MAX_VALUE },
		maximum: { type: [Number, String], default: 9 },
		clearInput: { type: Boolean, default: true },
		accept: { type: String, default: '*' },
		headers: {
			type: Object,
			default: () => {
				return {
					...createHeader(),
				}
			},
		},
		data: { type: Object, default: () => {} },
		xhrState: { type: [Number, String], default: 200 },
		multiple: { type: Boolean, default: true },
		disabled: { type: Boolean, default: false },
		autoUpload: { type: Boolean, default: true },
		maxDuration: { type: Number, default: 10 },
		beforeUpload: {
			type: Function,
			default: null,
		},
		beforeXhrUpload: {
			type: Function,
			default: null,
		},
		beforeDelete: {
			type: Function,
			default: () => {
				return true
			},
		},
		onChange: { type: Function },
		mode: {
			type: String,
			default: 'aspectFit',
		},
	},
	setup(props) {
		const beforeXhrUpload = (taroUploadFile, options) => {
			const uploadTask = taroUploadFile({
				url: options.url,
				filePath: options.taroFilePath,
				fileType: options.fileType,
				header: {
					'Content-Type': 'multipart/form-data',
					...options.headers,
				},
				formData: options.formData,
				name: options.name,
				success(response) {
					if (options.xhrState == response.statusCode) {
						const data = JSON.parse(response.data || '{}')
						if (data?.code === 1) {
							options.onSuccess?.(data.result, options)
						} else {
							Toast(data.message || '上传失败')
							options.onFailure?.(data, options)
						}
					} else {
						options.onFailure?.(response, options)
					}
				},
				fail(e) {
					options.onFailure?.(e, options)
				},
			})

			options.onStart?.(options)
			uploadTask.progress((res) => {
				options.onProgress?.(res, options)
			})
		}

		const handleSuccess = (ff) => {
			// ff.fileItem.url = baseURL + '/' + ff.data[0].fileUrl
			ff.fileItem.name = ff.data[0].fileName
			ff.fileItem.fileUrl = ff.data[0].fileUrl
			ff.fileItem.fileName = ff.data[0].fileName
		}

		const handleFail = (ff) => {
			console.info(ff)
			if (ff.fileItem) ff.fileItem.message = ff.data?.message || '上传失败'
		}

		return () => {
			const { url, containerClass, target, method, onChange, ...others } = props

			return (
				<View class={`components-uploader-box ${containerClass}`}>
					{/** @ts-ignore */}
					<Uploader
						{...others}
						onSuccess={handleSuccess}
						onFailure={handleFail}
						method="get"
						beforeXhrUpload={beforeXhrUpload}
						url={`${url}?customerId=${target['key']}&businessTypeKey=${target['bizKey']}`}
					></Uploader>
				</View>
			)
		}
	},
})
