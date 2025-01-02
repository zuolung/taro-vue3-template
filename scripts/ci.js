const ci = require('miniprogram-ci')
const path = require('path')
const fetch = require('node-fetch/lib/index')
const previewImagePath = path.resolve(__dirname, './preview.jpeg')
const pkg = require('../package.json')
const nodemailer = require('nodemailer')
const CWD = process.cwd()
const previewConfig = require('../preview.config')
const projectJson = require('../project.config.json')
const { getBranch, getLastedLog, getPreviewImage, isNewVersionFirstCommit } = require('./utils')

const { sendor, pass, emails } = previewConfig

;(async () => {
	const project = new ci.Project({
		appid: projectJson?.appid,
		type: 'miniProgram',
		projectPath: path.resolve(__dirname, '../weapp'),
		privateKeyPath: path.resolve(__dirname, 'weapp.key'),
		ignores: ['node_modules/**/*'],
	})

	console.info('1.镜像上传开始')

	const uploadResult = await ci.upload({
		project,
		version: pkg?.version,
		desc: '--',
		onProgressUpdate: console.log,
	})

	console.info('uploadResult:', uploadResult)

	console.info('*** 镜像上传完成')

	const newVersionFirstCommit = await isNewVersionFirstCommit()

	if (newVersionFirstCommit) {
		console.info('当前仅上传开发版本新版本代码，请前往开发平台设置体验版本')
		process.exit(0)
	}

	console.info('2. 预览版本生成开始')

	const previewResult = await ci.preview({
		project,
		desc: '',
		setting: {
			useProjectConfig: true,
		},
		qrcodeFormat: 'image',
		qrcodeOutputDest: path.resolve(__dirname, './preview1.jpg'),
		onProgressUpdate: console.log,
	})

	console.info('*** 预览版本生成完成')

	console.info('3. 体验版本生成开始')

	await getPreviewImage()

	console.info('*** 体验版本生成完成')

	const emailArr = sendor.split('@')
	const transporter = nodemailer.createTransport({
		host: `smtp.${emailArr[1]}`,
		port: 465,
		secureConnection: false,
		auth: {
			user: sendor,
			pass: pass,
		},
	})

	const send = (mailOptions) => {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.info('邮件发送失败：', error)
				process.exit(1)
				return
			}
			console.info('*** 邮件发送完成', info.messageId)

			process.exit(0)
		})
	}

	console.info('4. 邮箱通知发送开始')

	console.info('邮件接收人：', JSON.stringify(emails))

	const mailOptions = {
		from: sendor,
		to: emails,
		subject: '城配小程序测试环境发版',
		html: `
<h1>城配小程序测试环境发版</h1>
<h3>版本号：${pkg?.version}</h3>
<h3>二维码如下：</h3>
<div style="display: flex; flex-wrap: wrap">
	<div style="display: flex; flex-direction: column; width: max-content">
		<img src="cid:preview" width="300px" />
		<div style="text-align: center">体验版版</div>
	</div>
	<div style="display: flex; flex-direction: column; margin-left: 20px; width: max-content">
		<img src="cid:preview1" width="300px" />
		<div style="text-align: center">开发版(有效时间25分钟)</div>
	</div>
</div>
<h3>代码信息：</h3>
<h4>仓库分支：${getBranch()}</h4>
<h4>代码提交信息</h4>
<div>${getLastedLog()}</div>
		`,
		attachments: [
			{
				filename: 'preview.jpg',
				path: path.join(__dirname, './preview.jpg'),
				cid: 'preview',
			},
			{
				filename: 'preview1.jpg',
				path: path.join(__dirname, './preview1.jpg'),
				cid: 'preview1',
			},
		],
	}

	send(mailOptions)
})()
