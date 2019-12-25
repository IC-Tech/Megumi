const { Client, RichEmbed } = require('discord.js')
const client = new Client({ partials: ['MESSAGE', 'CHANNEL'] })
const auth = require('../auth.json')
const MongoClient = require('mongodb').MongoClient

var settings = {
	logs: !process.env.dev
}
var cachedDb
const MDB = async() => (cachedDb ? cachedDb : cachedDb = await (await MongoClient.connect(auth.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })).db('202000032040'))
const DB = async a => ((await MDB()).collection(a))
const MDB_Check = a => a && a.result && a.result.ok == 1
const admin = '473941394474401813'
const str = [
	'[no description provided by @ImeshChamar#1418]'
];
//username
//mention 1
//mention all
//arg all
const str1 = {
	cry: [ '😭 Cry', '**_0_** is now really sad _3_', 'cry', str[0] ],
	sad: [ '😭 Sad', '**_0_** is now really sad _3_', 'cry', str[0] ],
	happy: [ '😄 Happy', '**_0_** is really happy right now _3_', 'smile', str[0] ],
	smile: [ '😄 Smile', '**_0_** is really happy right now _3_', 'smile', str[0] ],
	pat: [ '✋ Pat', '**_0_** pats _3_', 'pat', str[0] ],
	hug: [ '👐 Hug', '**_0_** hugs _3_', 'hug', str[0] ],
	purr: [ '😻 Purr', '**_0_** purrs _3_', 'purr', str[0] ],
	yes: [ '👍 Yes', '**_0_** thinks it\'s great _3_', 'yes', str[0] ],
	no: [ '👎 No', '**_0_** thinks it\'s bad _3_', 'no', str[0] ],
	dance: [ '🕺 Dance', '**_0_** dances _3_', 'dance', str[0] ],
	bite: [ '🤤 Bite', '**_0_** bites _3_', 'bite', str[0] ],
	wave: [ '✋ Wave', '**_0_** waves _3_', 'wave', str[0] ],
	bye: [ '✋ Bye', '**_0_** says goodbye _3_', 'wave', str[0] ],
}
const col = [
	0xFF0000,
	0xFEFEFE,
	0x2ECC71
]
const fn_0 = a => {
	a = [a, a.channel, a.author, a.mentions]
	var b = null
	if(a[0].guild) b = a[0].guild.member(a[2]).nickname
	a.push(b ? b : a[2].username)
	return a
}
//https://discordapp.com/developers/docs/topics/opcodes-and-status-codes
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
			if(settings.logs) client.users.get(admin).send({
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
			description: 'Something went wrong, please try again later or contact the developer (type i.about).'
		}
	}).then(d).catch(d)
	b[0].react('❌').then(c).catch(c)
})
const fn_5 = (a, b, c) => {
	d = [
		_ => a = a.replace(_, b[4]),
		_ => a = a.replace(_, b[3][0]),
		_ => a = a.replace(_, b[3].join(' ')),
		_ => a = a.replace(_, c.slice(1).join(' '))
	]
	d.forEach((_a, _b) => a.match((_b = [_b, 0])[1] = new RegExp('_' + _b[0] + '_', 'g')) ? _a(_b[1]) : 0)
	return a
}
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
const sendActions = async (a, b, c) => {
	if(b.channel.type == 'dm') return
	b = fn_0(b)
	var e = str1[c]
	var d = (await (await DB('gifs')).findOne({name:e[2]})).d
	await fn_3(b, fn_5(e[0], b, a), fn_5(e[1], b, a), d[await getChannel({g: b[0].guild.id, c: b[1].id, n: c}, d.length, b[0].channel.type)])
}
const comm = {
	help: {
		des: str[0],
		ac: async (a,b) => {
			new ICError()
		}
	},
	avatar: {
		des: str[0],
		ac: async (a,b) => {
			if(b.channel.type == 'dm') return
			b = fn_0(b)
			var c = b[2].avatar ? b[2].avatarURL({size: 2048}) : 'https://cdn.discordapp.com/embed/avatars/1.png'
			await fn_1(b, {
				title:'🖼 Avatar',
				color: col[1],
				description: `**${b[4]}**'s avatar is located 🔗 [here](${c})`,
				image: {
					url: c
				}
			})
		}
	},
	about: {
		des: str[0],
		ac: async (a,b) => {
			await fn_1(fn_0(b), {
				color: 0x0099ff,
				title: 'About IC Bot',
				url: 'https://ic-tech.now.sh',
				author: {
					name: 'IC Bot', 
					icon_url: 'https://i.imgur.com/jVrtzic.png',
					url: 'https://ic-tech.now.sh'
				},
				description: 'IC Bot is first bot created by Imesh Chamara\nIt is still on development.',
				thumbnail: 'https://i.imgur.com/jVrtzic.png',
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
	system: {
		des: str[0],
		ac: async (a,b) => {
			b = fn_0(b)
			if(b[2].id != admin) {
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
			if(done) await fn_1(b, {
				title: '😎 Success',
				color: col[2],
				description: 'Request has successfully finished.'
			}, '✅')
		}
	}
}
const fn_6 = a=> ({
	des: comm[a].des,
	ac: comm[a].ac,
	cone: true
})
const clone = {
	sys: "system"
}
Object.keys(str1).forEach(a=> {
	var b = {}
	const c = a
	comm[a] = {
		des: str1[a][3],
		ac: async (a,b) => await sendActions(a, b, c)
	}
})
;([
	['sys', 'system']
]).forEach(a=> comm[a[0]] = fn_6(a[1]))
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity(`IC Bot state: ${process.env.dev ? 'Dev mode' : 'online'}`)
    //client.users.get(admin).send('IC-Bot is active')
})
client.on('messageReactionAdd', async (reaction, user) => {
	console.log('Reaction added; current count:', reaction.count)
})

client.on('messageReactionRemove', async (reaction, user) => {
	console.log('Reaction removed; current count:', reaction.count)
})
client.on('message', async msg => {
	var b = msg.content.toLowerCase()
	if(!['i.', 'ic.', 'i!', 'ic!'].some(a => b.startsWith(a))) return
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
