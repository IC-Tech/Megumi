const { Client, RichEmbed } = require('discord.js')
const client = new Client({ partials: ['MESSAGE', 'CHANNEL'] })
const auth = require('../auth.json')
const MongoClient = require('mongodb').MongoClient

var cachedDb
const MDB = async() => (cachedDb ? cachedDb : cachedDb = await (await MongoClient.connect(auth.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })).db('ic-tech'))
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
	cry: [
		'😭 Cry',
		'**_0_** is now really sad _3_'
	]
}
const col = [
	0xFF0000,
	0xFEFEFE
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
		if(a.code != 50013) {
			console.log(a)
		}
		try {
			await b[0].react('❌')
		}
		catch {}
	}
		/*
		re(a)*/
}
const fn_2 = (a, b= 1024) => (a = typeof a == 'string' ? a : (a ? a : '[-undefined-]').toString()).length > b ? (a.substr(0, b - 3) + '...') : a
const fn_3 = (b, ...a) => fn_1({
	color: 0xFEFEFE,
	title: a[0],
	description: a[1],
	image: {
		url: a[2]
	},
	timestamp: new Date()
})
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
			b = fn_0(b)
			console.log(b[0].guild.member(b[2]).nickname)
			await fn_1(b, {
				title:'🖼 Avatar',
				color: 0xFEFEFE,
				description: `**${b[2].username}**'s avatar is located 🔗 [here](${b[2].avatarURL({size: 2048})})`,
				image: {
					url: b[2].avatarURL({format: 'png', size: 512})
				}
			})
		}
	},
	cry: {
		des: str[0],
		ac: async (a,b) => {
			b = fn_0(b)
			await fn_3(b, `😭 Cry`, `**${b[2].username}** is now really sad uwu`, 'https://media1.tenor.com/images/98466bf4ae57b70548f19863ca7ea2b4/tenor.gif?itemid=14682297')
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
				fields: {
					name: 'Copyright © Imesh Chamara 2019',
					value: '**Discord:** ImeshChamara#1418\n**Website:** https://ic-tech.now.sh'
				},
				image: 'https://i.imgur.com/7BM6r9H.png',
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
					name: '🤖 ACCESS DENIED',
					color: 0xFF0000,
					descrption: 'You have not access to this function.'
				}, '❌')
				return
			}

			console.log(a)
		}
	},
	test: {
		des: str[0],
		ac: async (a,b) => {
    	b.channel.send({
    		embed: {
    			color: 0x0099ff,
    			title: 'Some title',
    			url: 'https://discord.js.org/',
    			author: {
						name: 'Some name',
						icon_url: 'https://i.imgur.com/wSTFkRM.png',
						url: 'https://discord.js.org',
					},
					description: 'Some description here',
					thumbnail: {
						url: 'https://i.imgur.com/wSTFkRM.png',
					},
					fields: [
						{
							name: 'Regular field title',
							value: 'Some value here',
						},
						{
							name: '\u200b',
							value: '\u200b',
						},
						{
							name: 'Inline field title',
							value: 'Some value here',
							inline: true,
						},
						{
							name: 'Inline field title',
							value: 'Some value here',
							inline: true,
						},
						{
							name: 'Inline field title',
							value: 'Some value here',
							inline: true,
						},
					],
					image: {
						url: 'https://i.imgur.com/wSTFkRM.png',
					},
					timestamp: new Date(),
					footer: {
						text: 'Some footer text here',
						icon_url: 'https://i.imgur.com/wSTFkRM.png',
					}
    		}
			});
		}
	}
};
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`IC Bot state: ${process.env.dev ? 'Dev mode' : 'online'}`);
    //client.users.get(admin).send('IC-Bot is active')
})
client.on('messageReactionAdd', async (reaction, user) => {
	console.log('Reaction added; current count:', reaction.count);
});

client.on('messageReactionRemove', async (reaction, user) => {
	console.log('Reaction removed; current count:', reaction.count);
});
client.on('message', async msg => {
	var b = msg.content.toLowerCase()
	if(!['i.', 'ic.', 'i!', 'ic!'].some(a => b.startsWith(a))) return
	var a = msg.content.split(' ')
	if(a[a.length - 1] == '') a.pop()
	b = a[0].indexOf('.')
	a[0] = a[0].substr((b > 0 ? b : a[0].indexOf('!')) + 1).toLowerCase()
	if(!Object.keys(comm).some(b => b == a[0])) return
	try {
		comm[a[0]].ac(a, msg)
	}
	catch(e) {
		console.log(typeof e)
		await fn_1(fn_0(msg), {
			name: '❌ IC-ERROR', 
			color: 0xFF0000, 
			description: 'Something went wrong, please try again later or contact the developer (type i.about).'
		}, '❌')
		client.users.get(admin).send({
			embed: {
				color: 0xF04342,
				title: '❌ Error',
				description: 'Error detected 0x01',
				field: [
					{name: 'name', value: fn_2(e.name)},
					{name: 'message', value: fn_2(e.message)}
				],
				timestamp: new Date(),
				file: {
					attachment: Buffer.from(JSON.stringify({
						name: fn_2(e.name, 1024 * 10),
						code: fn_2(e.code, 1024 * 10),
						message: fn_2(e.message, 1024 * 10),
						stack: fn_2(e.stack, 1024 * 10)
					})),
					name: new Date().toString() + '.json'
				}
			}
		})
	}
});
console.log('ready to login')
client.login(auth.token)
