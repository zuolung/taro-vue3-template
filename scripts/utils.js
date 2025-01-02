const cp = require('child_process')
const crypto = require('crypto')
const fs = require('fs')
const CryptoJS = require('crypto-js')
const { resolve } = require('path')
const path = require('path')
const fetch = require('node-fetch')
const xkeyPath = path.join(__dirname, './xkey.text')
const config = require('../project.config.json')
const sGit = require('simple-git')

/**
 *  package.json的版本是否更新
 *  每次需求的分支需要预打包一次生成机器人（手动切换体验版本），不会发邮件通知
 */
async function isNewVersionFirstCommit() {
	const git = sGit()
	const currentLogs = await git.log(['-1'])
	const currentLog = currentLogs.all[0]
	const prvLogs = await git.log(['-2'])
	const prvLog = prvLogs.all[0]

	const packageContent1 = await git.show([`${currentLog.hash}:package.json`])
	const packageContent2 = await git.show([`${prvLog.hash}:package.json`])
	const version1 = JSON.parse(packageContent1)?.version || ''
	const version2 = JSON.parse(packageContent2)?.version || ''

	return version1 !== version2
}

function getBranch() {
	const { stdout, error } = cp.spawnSync('git', ['branch'])
	if (error) {
		console.error(error)
		process.exit(1)
	}
	const branchsArr = `${stdout}`.match().input.split('\n')
	const b = branchsArr.filter((item) => item.indexOf('*') !== -1)
	return b[0]?.replace(/\*|\s/g, '')
}

function getLastedLog(num = 10) {
	const { stdout, error } = cp.spawnSync('git', ['log'])
	if (error) {
		console.error(error)
		process.exit(1)
	}
	let logInfoArr = `${stdout}`.match().input.split('\n')
	logInfoArr = logInfoArr.map((it) => {
		return it?.replace(/\<|\>/g, '') || ''
	})
	const logInfo = logInfoArr.splice(0, num * 6).join('<br />')
	return logInfo
}

const safeKey = {
	key: 'jiangling-lexing-s-key',
	create(message) {
		return CryptoJS.AES.encrypt(message, this.key).toString()
	},
	real(text) {
		var bytes = CryptoJS.AES.decrypt(text, this.key)
		var message = bytes.toString(CryptoJS.enc.Utf8)
		return message
	},
}

function getPreviewImage() {
	const xkey = fs.readFileSync(xkeyPath, 'utf-8')
	const SKEY = safeKey.real(xkey)
	let access_token
	return new Promise((resolve) => {
		fetch(
			`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${SKEY}`
		)
			.then((res) => res.json())
			.then((res) => {
				if (res.access_token) {
					access_token = res.access_token

					fetch(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`, {
						method: 'POST',
						body: JSON.stringify({ env_version: 'trial', scene: 'utf-8' }),
					}).then((res) => {
						const imagePath = path.resolve(__dirname, './preview.jpg')
						const fileStream = fs.createWriteStream(imagePath)
						res.body.pipe(fileStream)

						resolve()
					})
				}
			})
	})
}

module.exports = {
	getBranch,
	getLastedLog,
	safeKey,
	getPreviewImage,
	xkeyPath,
	isNewVersionFirstCommit,
}
