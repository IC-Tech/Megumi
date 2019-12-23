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
		await fn_4(a, b)
	}
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
	cry: {
		des: str[0],
		ac: async (a,b) => {
			if(b.channel.type == 'dm') return
			b = fn_0(b)
			var c = str1.cry
			await fn_3(b, fn_5(c[0], b, a), fn_5(c[1], b, a), 'https://media1.tenor.com/images/98466bf4ae57b70548f19863ca7ea2b4/tenor.gif?itemid=14682297')
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
    client.user.setActivity(`IC Bot state: ${process.env.dev ? 'Dev mode' : 'online'}`)
    console.log(await getChannel({g: '474625296038100992', c: '653185338092683274', n: 'cry'}))
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
		await comm[a[0]].ac(a, msg)
	}
	catch(e) {
		await fn_4(e, fn_0(msg))
	}
});
console.log('ready to login')
client.login(auth.token)
