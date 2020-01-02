const { Client, RichEmbed } = require('discord.js')
const client = new Client({ partials: ['MESSAGE', 'CHANNEL'] })
const auth = require('../auth.json')
const MongoClient = require('mongodb').MongoClient
const actions = require('./actions.js').actions
const col = require('./colors.js').colors
const str = require('./strings.json')
const config = require('../config.json')
const gif = require('./gif.js').gif

var settings = {
	logs: !process.env.dev
}
var cachedDb
const MDB = async() => (cachedDb ? cachedDb : cachedDb = await (await MongoClient.connect(auth.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })).db('202000032040'))
const DB = async a => ((await MDB()).collection(a))
const MDB_Check = a => a && a.result && a.result.ok == 1

const fn_0 = a => {
	a = [a, a.channel, a.author, a.mentions ]
	var b = null
	if(a[0].guild) b = a[0].guild.member(a[2]).nickname
	a.push(b ? b : a[2].username)
	a.push(a[0].guild && a[0].guild.available ? a[0].guild : null)
	return a
}
const fn_1 = async (b, a, c = '✅') => {
	try {
		await b[1].send({
			embed: a
		})
		await b[0].react(c)
	}
	catch (a) {
		await fn_4(a, b)
	}
}
const fn_2 = (a, b= 1024) => (a = typeof a == 'string' ? a : (a ? a : '[-undefined-]').toString()).length > b ? (a.substr(0, b - 3) + '...') : a
const fn_3 = (b, ...a) => fn_1(b, {
	color: col[1],
	title: a[0],
	description: a[1],
	image: {
		url: a[2]
	},
	timestamp: new Date()
})
const fn_4 = (a, b) => new Promise((_a, _b) => {
	var d = _ => {
		if(a.code != 50013) {
			console.log(new Date(), a)
			if(settings.logs) client.users.get(config.admin).send({
				embed: {
					color: 0xF04342,
					title: '❌ Error',
					description: 'nii-chan tasukete, error desu',
					field: [
						{name: 'name', value: fn_2(a.name)},
						{name: 'message', value: fn_2(a.message)}
					],
					timestamp: new Date()
				},
				files: [
					{
						attachment: Buffer.from(JSON.stringify({
						name: fn_2(a.name, 1024 * 10),
							code: fn_2(a.code, 1024 * 10),
							message: fn_2(a.message, 1024 * 10),
							stack: fn_2(a.stack, 1024 * 10)
						})),
						name: 'bug-report.json'
					}
				]
			})
		}
	}
	var c = _ => b[1].send({
		embed: {
			name: '❌ IC-ERROR',
			color: col[0],
			description: 'Something went wrong, please try again later or contact the developer (type M.about).'
		}
	}).then(d).catch(d)
	b[0].react('❌').then(c).catch(c)
})
const fn_5 = (a, b, c) => {
	d = [
		_ => a = a.replace(_, b[4]),
		_ => a = a.replace(_, b[3][0]),
		_ => a = a.replace(_, b[3].join(' ')),
		_ => a = a.replace(_, c.slice(1).join(' ')),
		_ => a = a.replace(_, b[5].name)
	]
	d.forEach((_a, _b) => a.match((_b = [_b, 0])[1] = new RegExp('_' + _b[0] + '_', 'g')) ? _a(_b[1]) : 0)
	return a
}
const acUp = a => client.user.setActivity(`M.help • Bot: ${process.env.dev ? 'Developing' : 'Online'} • Servers: ${client.guilds.size} • Users: ${client.users.size}`, { type: 'WATCHING'})
const db_findNUpdate = async (a, b, op) => {
	var c = await a.findOne(op.f)
	var d = b((!op.noFill || op.def) && !c ? (op.def ? op.def : {}) : c)
	if(!d) return
	if(!c) {
		if (!MDB_Check(await a.insertOne(Object.assign(op.f, d), {}))) throw new Error('db_findNUpdate faild 0')
	}
	else if(!MDB_Check(await a.updateOne(op.f, {$set: d}, {}))) throw new Error('db_findNUpdate faild 1')
}
const getChannel = async (a, d, e) => {
	var b = await DB('channel')
	var c
	await db_findNUpdate(b, a => {
		return (a = [c = (a.a = ((a.a++) >= --d ? 0 : a.a)), a.t = e, a])[2]
	}, {f: a, def: {a: 0}})
	return c
}
const noDM = async a => {
	if(a.channel.type == 'dm') {
		await fn_1(fn_0(a), {
			color: col[6],
			author: {
				name: 'Megumi Bot',
				icon_url: config.icon,
			},
			description: `This command can only use in server channel.\n**Megumi-chan invite link: ** <https://discordapp.com/oauth2/authorize?&client_id=${config.app_id}&scope=bot&permissions=470150263> \n*I-I-Its not like I want to join your server or anything!* :flushed:\nBaka!!`,
			thumbnail: config.icon,
			/* -- emotional force invite --
			image: {
				url: 'https://media1.tenor.com/images/b7e132fd3f4e110ea54ef8aa8f4eebbe/tenor.gif?itemid=15650605'
			},
			*/
			timestamp: new Date()
		})
		return 1
	}
}
const sendActions = async (a, b, c) => {
	if(await noDM(b)) return
	b = fn_0(b)
	var e = actions[c]
	var d = (await (await DB('gifs')).findOne({name:e[2]})).d
	await fn_3(b, fn_5(e[0], b, a), fn_5(e[1], b, a), d[await getChannel({g: b[5].id, c: b[1].id, n: c}, d.length, b[0].channel.type)])
}
const comm = {
	help: {
		des: str.command.help,
		ac: async (a,b) => {
			var c = 
`Use **M.help [command]** to get more info on a specific command, for example: **M.help smile**

**Profile**
${"`"}avatar${"`"}

**Roleplay**
${"`"}${Object.keys(actions).join(', ')}${"`"}

**External**
${"`"}gif${"`"}

**Management**
${"`"}set${"`"}

**Information**
${"`"}ping, about, help${"`"}
`
			var d = col[3]
			if(a.length > 1) {
				if(comm[a[1]]) c = comm[a[1]].des
				else {
					c = `<@${config.megumi}> doesn't have command like that. try **M.help** to find commands.`
					d = col[6]
				}
			}
			await fn_1(fn_0(b), {
				color: d,
				title: `❔ Help${a.length > 1 ? ` » ${a[1]}` : ''}`,
				description: c
			})
		}
	},
	avatar: {
		des: str.command.avatar,
		ac: async (a,b) => {
			if(await noDM(b)) return
			b = fn_0(b)
			if(b[3].users.size > 0) b[2] = b[3].users.get(Array.from(b[3].users.keys())[0])
			var c = b[2].avatar ? b[2].avatarURL({size: 2048}) : 'https://cdn.discordapp.com/embed/avatars/1.png'
			var d = b[5] ? b[5].member(b[2]).nickname : b[2].username
			d = d ? d : b[2].username
			await fn_1(b, {
				title:'🖼 Avatar',
				color: col[1],
				description: `**${d}**'s avatar is located 🔗 [here](${c})`,
				image: {
					url: c
				}
			})
		}
	},
	about: {
		des: str.command.about,
		ac: async (a,b) => {
			await fn_1(fn_0(b), {
				color: 0x0099ff,
				title: 'About Megumi Bot',
				url: 'https://ic-tech.now.sh',
				author: {
					name: 'Megumi Bot',
					icon_url: config.icon,
					url: 'https://ic-tech.now.sh'
				},
				description: 'Megumi is first bot created by Imesh Chamara\nIt is still on development.\n\nThis bot is open-source and totally free.',
				thumbnail: config.icon,
				fields: [
					{
						name: 'Copyright © Imesh Chamara 2019',
						value: '**Discord:** ImeshChamara#1418\n**Website:** https://ic-tech.now.sh'
					}
				],
				image: {
					url: 'https://i.imgur.com/7BM6r9H.png'
				},
				timestamp: new Date()
			})
		}
	},
	ping: {
		des: str.command.ping,
		ac: async (a,b) => {
			var c
			if(a.length > 1 && (a[1].toLowerCase() == 'full' || a[1].toLowerCase() == 'max')) {
				for(var c=0; c < (a[1].toLowerCase() == 'max' ? 4 : 1); c++)
					await db_findNUpdate(await DB('system'), a => ([a.a++, a])[1], {f: {t:'temp-ping'}, def:{t:'temp-ping', a: 0}})
				c = 1
			}
			await fn_1(fn_0(b), {
				color: col[7],
				title: '⏱ Ping',
				description: `Yes, I'm online. ${process.env.dev ? 'but I\'m in development mode. ': ''}${(new Date() - b.createdAt) + 'ms'} has taken to recive your message${c ? ' using external database' : ''}.`
			})
		}
	},
	system: {
		des: str.command.system,
		ac: async (a,b) => {
			b = fn_0(b)
			if(b[2].id != config.admin) {
				await fn_1(b, {
					title: '🤖 ACCESS DENIED',
					color: col[0],
					description: 'You have not access to this function.'
				}, '❌')
				return
			}
			var done
			if(a.length >= 5 && a[1] == 'add' && a[2] == 'image') {
				await db_findNUpdate(await DB('gifs'), b => {
					a.slice(3).forEach(a => a.startsWith('https://') && !b.d.some(b => b == a) ? b.d.push(a) : 0)
					return b
				}, {f: {name: a[3]}, def: {name: a[3], d: []}})
				done = 1
			}
			else if(a.length >= 5 && a[1] == 'rem' && a[2] == 'image') {
				await db_findNUpdate(await DB('gifs'), b => {
					var c = []
					b.d.forEach(b => b == a[4] ? 0 : c.push(b))
					if(c.length == b.d.length) return
					b.d = c
					return b
				}, {f: {name: a[3]}, def: {name: a[3], d: []}})
				done = 1
			}
			else if(a.length >= 4 && a[1] == 'len' && a[2] == 'image') {
				done = ['']
				await Promise.all(a.slice(3).map(a => new Promise(async d => {
					await db_findNUpdate(await DB('gifs'), b => {
						done[0] += `${a} command is ${b.d.length} long\n`
					}, {f: {name: a}, def: {name: a, d: []}})
					d()
				})))
			}
			if(done) await fn_1(b, {
				title: done == 1 || done.length == 1 ? '😎 Success' : done[0],
				color: col[2],
				description: done == 1 ? 'Request has successfully finished.' : (done.length == 1 ? done[0] : done[1])
			}, '✅')
		}
	},
	set: {
		des: str.command.set,
		ac: async (a,b) => {
			if(await noDM(b)) return
			a = a.slice(1)
			b = fn_0(b)
			const e = async a => await fn_1(b, {
				color: col[0],
				title: '❌ INVALID ARGUMENTS',
				description: 'specific command not found, try **M.help set** for more info.',
				timestamp: new Date()
			}, '❌')
			if(a.length == 0) return await e()
			a[0] = a[0].toLowerCase()
			if(a[0] == 'welcome' || a[0] == 'bye') {
				if(a[1].toLowerCase() == 'no') {
					await db_findNUpdate(await DB('guild'), a => ([delete a.wel, a])[1], {f: {t:'guild', g: b[5].id}, def: Object.assign({t:'guild', g: b[5].id}, a[0] == 'bye' ? ({bye: 0}) : ({wel: 0}))})
					a[1] = 'no'
				}
				if(b[3].channels.size < 0)
					return await fn_1(b, {
						color: col[0],
						title: '❌ INVALID ARGUMENTS',
						description: 'You have to mention a channel',
						timestamp: new Date()
					}, '❌')
				await db_findNUpdate(await DB('guild'), _a => ([_a[a[0] == 'bye' ? 'bye' : 'wel'] = Array.from(b[3].channels.keys())[0], _a])[1], {f: {t:'guild', g: b[5].id}, def: {t:'guild', g: b[5].id}})
				await fn_1(b, {
					color: col[6],
					title: '👍 Success',
					description: `The ${a[0] == 'bye' ? 'Good bye' : 'welcome'} meaages will ${a[1] == 'no' ? 'not received' : ('received in <#' +Array.from(b[3].channels.keys())[0] + '>')}`,
					timestamp: new Date()
				})
			}
			else await e()
		}
	},
	gif: {
		des: str.command.gif,
		ac: async (a, b) => {
			if(await noDM(b)) return 
			a = a.slice(1).join(' ')
			if(a.length > 50 || a.length == 0) return await fn_1(fn_0(b), {
				color: col[0],
				title: '❌ INVALID REQUEST',
				description: a.length == 0 ? 'Please provide a search keyword. try **m.help gif** for more information.' : 'search keyword is too long for search. it must be under 50 characters.',
				timestamp: new Date()
			}, '❌')
			a = await gif({q:a})
			if(a[0] == 2) return await fn_4(a[1], fn_0(b))
			a = a[1]
			var c
			if(a.length > 0) c = `[${(a[0].title ? a[0].title : (decodeURIComponent(a[0].itemurl).replace('https://tenor.com/view/', '')))}](${a[0].itemurl})`
			else c = `**Sorry!**, I can't find a gif. 😭`
			await fn_1(fn_0(b), {
				color: col[a.length > 0 ? 7 : 6],
				title: '🖼 GIF',
				description: c,
				image: {
					url: a.length > 0 ? a[0].media[0].gif.url : 'https://i.imgur.com/FG3ZCGa.gif'
				},
				footer: a.length > 0 ? ({text: 'Powered By Tenor'}) : undefined
			})
		}
	}
}
const fn_6 = a=> ({
	des: comm[a].des,
	ac: comm[a].ac,
	cone: true
})
Object.keys(actions).forEach(a=> {
	var b = {}
	const c = a
	comm[a] = {
		des: actions[a][3] + str.common[1].replace(/_0_/g, a),
		ac: async (a,b) => await sendActions(a, b, c)
	}
})
;([
	['sys', 'system'],
	['info', 'about']
]).forEach(a=> comm[a[0]] = fn_6(a[1]))
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)
    acUp()
    //client.users.get(config.admin).send('IC-Bot is active')
})
/* future code function, no need for now
client.on('messageReactionAdd', async (reaction, user) => {
	console.log('Reaction added; current count:', reaction.count)
})
client.on('messageReactionRemove', async (reaction, user) => {
	console.log('Reaction removed; current count:', reaction.count)
})
*/
client.on('guildCreate', async a => acUp())
client.on('guildDelete', async a => {
	acUp()
	//cleanGuild()
})
client.on('guildMemberRemove', async a => {
	acUp()
	var b = await (await DB('guild')).findOne({t:'guild', g: a.guild.id})
	if(!b && b.bye) return
	var c = a.user.avatar ? a.user.avatarURL({size: 128}) : 'https://cdn.discordapp.com/embed/avatars/1.png?size=128'
	await (await client.channels.fetch(b.bye)).send({
		embed: {
			color: col[6],
			author: {
				name: a.user.username,
				icon_url: c
			},
			description: `Good bye <@${a.user.id}> from **${a.guild.name}**`,
			thumbnail: {
				url: c
			},
			timestamp: new Date()
		}
	})
})
client.on('guildMemberAdd', async a => {
	acUp()
	var b = await (await DB('guild')).findOne({t:'guild', g: a.guild.id})
	if(!b && b.wel) return
	var c = a.user.avatar ? a.user.avatarURL({size: 128}) : 'https://cdn.discordapp.com/embed/avatars/1.png?size=128'
	await (await client.channels.fetch(b.wel)).send({
		embed: {
			color: col[2],
			author: {
				name: a.user.username,
				icon_url: c
			},
			description: `welcome <@${a.user.id}> to **${a.guild.name}**`,
			thumbnail: {
				url: c
			},
			timestamp: new Date()
		}
	})
})
client.on('message', async msg => {
	if(msg.author.bot) return
	var b = msg.content.toLowerCase()
	if(!['m.'/*, 'ic.', 'i!', 'ic!'*/].some(a => b.startsWith(a))) return
	var a = msg.content.split(' ')
	if(a[a.length - 1] == '') a.pop()
	b = a[0].indexOf('.')
	a[0] = a[0].substr((b > 0 ? b : a[0].indexOf('!')) + 1).toLowerCase()
	if(!Object.keys(comm).some(b => b == a[0])) return
	try {
		await comm[a[0]].ac(a, msg)
	}
	catch(e) {
		await fn_4(e, fn_0(msg))
	}
})
console.log('ready to login')
client.login(auth.token)
