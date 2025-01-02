const fs = require('fs')
const path = require('path')
const xkeyPath = path.join(__dirname, './xkey.text')

if (process.argv.length > 2) {
	fs.writeFileSync(xkeyPath, process.argv[2])
} else {
	console.info('unset S_KEY', process.env.S_KEY)
	process.exit(1)
}

module.exports = {
	xkeyPath,
}
