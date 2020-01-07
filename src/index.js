const os = require('os')
const { Client, RichEmbed } = require('discord.js')
const client = new Client({ partials: ['MESSAGE', 'CHANNEL'] })
const auth = require('../auth.json')
const MongoClient = require('mongodb').MongoClient
const actions = require('./actions.js').actions
const col = require('./colors.js').colors
const str = require('./strings.json')
const config = require('../config.json')
const gif = require('./gif.js').gif
const perm = require('./permissions.js')
const error = require('./errors.js')
const ver = require('../package.json').version

var settings = {
	logs: !process.env.dev
}
var cachedDb
const MDB = async() => (cachedDb ? cachedDb : cachedDb = await (await MongoClient.connect(auth.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })).db(config.DB))
const DB = async a => ((await MDB()).collection(a))
const MDB_Check = a => a && a.result && a.result.ok == 1
const dStr = a => {
	var b = 0
	while (a >= 1024) {
		a = a / 1024
		b++
	}
	return (parseInt(a * 10) / 10) + (['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'])[b]
}

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
		var d = await b[1].send({
			embed: a
		})
		if(c) await b[0].react(c)
		return d
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
			title: '❌ ERROR',
			color: col[0],
			description: error.getString(a.code),
			timestamp: new Date()
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
	var c
	await db_findNUpdate(await DB('guild'), res => {
		if(!res.channel) res.channel = {}
		if(!res.channel[a.c]) res.channel[a.c] = {}
		if(!res.channel[a.c][a.n]) res.channel[a.c][a.n] = { val: 0 }
		return (res = [c = (res.channel[a.c][a.n].val = ((res.channel[a.c][a.n].val++) >= --d ? 0 : res.channel[a.c][a.n].val)), res])[1]
	}, {f: {t:'guild', g: a.g}, def: {t:'guild', g: a.g}})
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
const modComm = async (a,b) => {
	if(await noDM(a)) return 1
	if(b[5].ownerID != b[2].id) return 2
}
const sendActions = async (a, b, c) => {
	if(await noDM(b)) return
	b = fn_0(b)
	var e = actions[c]
	var d = (await (await DB('gif')).findOne({name:e[2]})).d
	await fn_3(b, fn_5(e[0], b, a), fn_5(e[1], b, a), d[await getChannel({g: b[5].id, c: b[1].id, n: c}, d.length, b[0].channel.type)])
}
const ban_kick = async (a,b, _) => {
	if(await noDM(b)) return 
	b = fn_0(b)
	var c = Array.from(b[3].users.keys())
	var e = async a => await fn_1(b, {
		color: col[0],
		title: '❌ INVALID REQUEST',
		description: a,
		timestamp: new Date()
	}, '❌')
	if(c.length < 1) return await e(`Please mention users for ${_ == 1 ? 'ban' : 'kick'}.`)
	if(!b[5].member(b[2]).hasPermission(_ == 1 ? perm.BAN_MEMBERS : perm.KICK_MEMBERS)) return await e(`You don't have permissions to ${_ == 1 ? 'Ban' : 'Kick'} users.`)
	if(c.indexOf(b[2].id) >= 0) return await e(`You can't ${_ == 1 ? 'ban' : 'kick'} yourself.`)
	//var f = parseInt(a[a.length - 1])
	//if(_ == 1 || a[a.length - 1] != f.toString()) f = NaN
	//else delete a[a.length - 1]
	var d = ''
	a.slice(1).forEach(a=> a && !(a.startsWith('<@') && a.endsWith('>')) ? (d += (a + ' ')) : 0)
	d = d.substr(0, d.length - 1)
	a = {}
	if(d) a.reason = d
	//if(!isNaN(f)) a.days = f
	var g = (await fn_1(b, {
		color: col[7],
		title: _ == 1 ? `😞 Ban users` : `😞 Kick users`,
		description: `**${b[4]}** you are going to kick, ${c.map(a=>`<@${a}>`).join(', ')}${d ? `\n**reason**: *${d}*` : ''}\nclick ✅ for confirm.\nclick ❌ for cancel.`,
		timestamp: new Date()
	}))
	g.react('✅')
	g.react('❌')
	var rc = g.createReactionCollector((r, u) => u.id == b[2].id && (r.emoji.name == '✅' || r.emoji.name == '❌'), { time: config.react_timeout })
	rc.on('collect', a => rc.stop())
	rc.on('end', async mr => {
		if(mr.size < 1) return
		(mr = mr.get(mr.keys().next().value)).message.delete()
		var en = mr.emoji.name
		if(en == '✅') await Promise.all(c.map(c => new Promise(async (_a, _b) => {
			try {
				if(_ == 1) _a(await b[5].member(c).ban(a))
				else _a(await b[5].member(c).kick(a.reason))
			}
			catch(e) { await fn_4(e, b) }
		})))
		await fn_1(fn_0(mr.message), {
			color: en == '❌' ? col[2] : col[6],
			title: (en == '❌' ? '😅' : (_ == 1 ? '👿' : '😡')) + (_ == 1 ? ` Ban users` : ` Kick users`),
			description: en == '❌' ? `${c.map(a=>`<@${a}>`).join(', ')} has not been ${_ == 1 ? 'baned' : 'kicked'}` : `${c.map(a=>`<@${a}>`).join(', ')} has been ${_ == 1 ? 'baned' : 'kicked'} by **${b[4]}**.${d ? `\n**reason**: *${d}*` : ''}`,
			timestamp: new Date()
		}, null)
	})
}
const welcome_bye = async (a , b, c) => {
	if(await noDM(b)) return 
	b = fn_0(b)
	var e = async a => await fn_1(b, {
		color: col[0],
		title: '❌ INVALID REQUEST',
		description: a,
		timestamp: new Date()
	}, '❌')
	if(b[2].id != b[5].ownerID) return await e(`**${b[4]}**, you don't have permissions for this action.`)
	if(a.length < 2 || !((a[1] = a[1].toLowerCase()) == 'no' || b[3].channels.size > 0)) return await e(`You have to mention a channel to get ${c == 1 ? 'goodbye': 'welcome'} messages or use no to stop ${c == 1 ? 'goodbye': 'welcome'} messages.\nuse **M.help ${c == 1 ? 'bye': 'welcome'}** for more info.`)
	var e = null
	if(a[1] != 'no') e = b[3].channels.keys().next().value
	await db_findNUpdate(await DB('guild'), a => ([a[c == 1 ? 'bye' : 'wel'] = e, a])[1], {f:{t:'guild', g: b[5].id}, def: Object.assign({t:'guild', g: b[5].id}, c == 1 ? ({bye: 1}) : ({wel: 1}))})
	await fn_1(b, {
		color: col[7],
		title: `🤗 ${c == 1 ? 'Goodbye': 'Welcome'}`,
		description: `Megumi will ${e ? '' : 'not'} send ${c == 1 ? 'goodbye': 'welcome'} messages${e ? ` in <#${e}>`: ''}.`,
		timestamp: new Date()
	})
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
${"`"}userkick, ban, welcome, goodbye${"`"}

**Information**
${"`"}ping, stats, about, help${"`"}
`
			var e = 1
			var d = col[3]
			if(a.length > 1) {
				e = 2
				if(comm[(a[1] = a[1].toLowerCase())]) c = comm[a[1]].des
				else {
					c = `<@${config.megumi}> doesn't have command like that. try **M.help** to find commands.`
					d = col[6]
					e = 1
				}
			}
			await fn_1(fn_0(b), Object.assign({
				color: d,
				title: `❔ Help${a.length > 1 ? ` » ${a[1]}` : ''}`,
				description: c,
				timestamp: new Date()
			}, e == 1 ? ({
				footer: {
					text: 'Bot by ImeshChamara#1418',
					icon_url: 'https://i.imgur.com/TCmnCFZ.png'
			}}) : ({})))
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
				},
				timestamp: new Date()
			})
		}
	},
	about: {
		des: str.command.about,
		ac: async (a,b) => {
			await fn_1(fn_0(b), {
				color: 0x0099ff,
				title: 'About Megumi Bot',
				author: {
					name: 'Megumi Bot',
					icon_url: config.icon
				},
				description: 
`Megumi is first bot created by Imesh Chamara. Megumi bot is open-source and totally free. She specially made for Roleplay but she also have other commands. and she contains more than ${Object.keys(comm).length} commands. I hope you like Megumi and have fun with her.
Megumi maybe lagging and offline sometimes because she still haven't a server machine yet (I don't have money for server machine). She is hosting from my home, sorry for that.

Have a fun with Megumi (*It's not like I want you to have fun with Megumi-chan.* :flushed:)

**Prefix:** M.
**Help:** M.help
**Megumi's Coding Language:** NodeJS (version: 12.13.0)
**Bot Library:** DiscordJS (version: unstable master)
**Libraries used:** 2
**Created:** 2019.12.15 19:30 (GTM +0530)`,
				thumbnail: config.icon,
				fields: [
					{
						name: 'Project by **Imesh Chamara**',
						value: '**Discord:** ImeshChamara#1418\n**Support Server:** <https://discord.gg/CAmERp2>**\nDeveloper Contact**: <https://ic-tech.now.sh>'
					}
				],
				image: {
					url: 'https://i.imgur.com/7BM6r9H.png'
				},
				footer: {
					text: 'Bot by ImeshChamara#1418',
					icon_url: 'https://i.imgur.com/TCmnCFZ.png'
				},
				timestamp: new Date()
			})
		}
	},
	ping: {
		des: str.command.ping,
		ac: async (a,b) => {
			var c, d = `${(new Date() - b.createdAt) + 'ms'} has taken to recive your message.`, e = new Date()
			if(a.length > 1 && ((a[1] = a[1].toLowerCase()) == 'full' || a[1] == 'max')) {
				for(var c=0; c < (a[1] == 'max' ? 4 : 1); c++)
					await db_findNUpdate(await DB('system'), a => ([a.a++, a])[1], {f: {t:'temp-ping'}, def:{t:'temp-ping', a: 0}})
				var f = new Date()
				d = `**Message: **${e - b.createdAt}ms\n**DB: **${f - e}ms\n`
				if(a[1] == 'max') d += `**DB Avg: **${(f - e) / 4}ms\n`
				d += `**All: **${f - b.createdAt}ms`
			c = 1
			}
			await fn_1(fn_0(b), {
				color: col[7],
				title: '⏱ Ping',
				description: `Yes, I'm online. ${process.env.dev ? `but I\'m in development mode. `: ''}${!c ? '' : '\n'}${d}`,
				timestamp: new Date()
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
					description: 'You have not access to this function.',
					timestamp: new Date()
				}, '❌')
				return
			}
			var done
			if(a.length >= 5 && a[1] == 'add' && a[2] == 'image') {
				await db_findNUpdate(await DB('gif'), b => {
					a.slice(3).forEach(a => a.startsWith('https://') && !b.d.some(b => b == a) ? b.d.push(a) : 0)
					return b
				}, {f: {name: a[3]}, def: {name: a[3], d: []}})
				done = 1
			}
			else if(a.length >= 5 && a[1] == 'rem' && a[2] == 'image') {
				await db_findNUpdate(await DB('gif'), b => {
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
					await db_findNUpdate(await DB('gif'), b => {
						done[0] += `${a} command is ${b.d.length} long\n`
					}, {f: {name: a}, def: {name: a, d: []}})
					d()
				})))
			}
			if(done) await fn_1(b, {
				title: done == 1 || done.length == 1 ? '😎 Success' : done[0],
				color: col[2],
				description: done == 1 ? 'Request has successfully finished.' : (done.length == 1 ? done[0] : done[1]),
				timestamp: new Date()
			}, '✅')
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
				footer: a.length > 0 ? ({text: 'Powered By Tenor'}) : undefined,
				timestamp: new Date()
			})
		}
	},
	stats: {
		des: str.common[0],
		ac: async (a, b) => {
			await fn_1(fn_0(b), {
			color: col[8],
			author: {
				name: `Megumi ${ver}`,
				icon_url: config.icon
			},
			description:
`${process.env.dev ? '_**Megumi** is in developing computer, not in hosting server._\n' : ''}**CPU**: ${os.arch()} ${os.cpus()[0].speed}MHz
**CPU Core**: ${os.cpus().length}
**OS**: ${os.platform()}
**Uptime**: ${(a=> {
	var b = (a,c) => {
		var b = parseInt(a / c)
		a = a - (b * c)
		return [a, b]
	}
	var c = b(a, 60 * 60 * 24)
	var d = b(c[0], 60 * 60)
	var e = b(d[0], 60)
	return `${c[1]} days, ${d[1]} hours, ${e[1]} minutes, ${e[0]} seconds`
})(os.uptime())}
**Memory**: ${dStr(os.totalmem() - os.freemem()) + '/' + dStr(os.totalmem())}
**Servers**: ${client.guilds.size}
**Users**: ${client.users.size}
**Commands**: ${Object.keys(comm).length}+
`,
				thumbnail: {
					url: config.icon
				},
				timestamp: new Date()
			})
		}
	},
	ban: {
		des: str.command.ban,
		ac: async (a, b) => await ban_kick(a,b,1)
	},
	userkick: {
		des: str.command.kick,
		ac: async (a, b) => await ban_kick(a,b,2)
	},
	invite: {
		des: str.command.invite,
		ac: async (a, b) => {
			await fn_1(fn_0(b), {
				color: col[6],
				author: {
					name: 'Megumi Bot',
					icon_url: config.icon,
				},
				description: `**Megumi-chan invite link: ** <https://discordapp.com/oauth2/authorize?&client_id=${config.app_id}&scope=bot&permissions=470150263> \n*I-I-Its not like I want to join your server or anything!* :flushed:\nBaka!!`,
				thumbnail: config.icon,
				image: {
					url: 'https://media1.tenor.com/images/b7e132fd3f4e110ea54ef8aa8f4eebbe/tenor.gif?itemid=15650605'
				},
				timestamp: new Date()
			})
		}
	},
	welcome: {
		des: str.command.welcome,
		ac: async (a, b) => await welcome_bye(a,b,0)
	},
	goodbye: {
		des: str.command.goodbye,
		ac: async (a, b) => await welcome_bye(a,b,1)
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
	['info', 'about'],
	['statistics', 'stats']
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
client.on('guildCreate', async a => {
	if(process.env.dev) return
	acUp()
	await db_findNUpdate(await DB('guild'), a=>([a.created = new Date('12/08/2019'), a])[1], {f: {t:'guild', g:a.id}, def: {t:'guild', g:a.id}})
})
client.on('guildDelete', async a => {
	if(process.env.dev) return
	acUp()
	await (await DB('guild')).deleteOne({t:'guild', g: a.id})
})
client.on('guildMemberRemove', async a => {
	if(process.env.dev) return
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
	if(process.env.dev) return
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
	if(process.env.dev && msg.author.id != config.admin) return
	var b = msg.content.toLowerCase()
	if(![process.env.dev ? 'md.' : 'm.'/*, 'ic.', 'i!', 'ic!'*/].some(a => b.startsWith(a))) return
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
