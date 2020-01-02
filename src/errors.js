//https://discordapp.com/developers/docs/topics/opcodes-and-status-codes
const config = require('../config.json')
exports.getString = a => {
	var b = ({
		'50013': `<@${config.megumi}> haven't permissions for that.`
	})[a]
	return b ? b : 'Something went wrong, please try again later or contact the developer (type M.about).'
}
