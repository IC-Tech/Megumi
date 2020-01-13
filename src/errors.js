//https://discordapp.com/developers/docs/topics/opcodes-and-status-codes
const config = require('../config.json')
exports.getString = a => {
	var b = ({
		'50013': `<@${config.megumi}> haven't permissions for that.`,
		'10003': `Requested Channel can't be found.`
	})[a]
	return b ? b : 'Something went wrong, please try again later or contact the developer (type M.about).'
}
exports.notBugs = [50013, 10003, 50001]
