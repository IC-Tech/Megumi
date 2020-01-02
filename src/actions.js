const str = require('./strings.json')

//username
//mention 1
//mention all
//arg all
//Chanel name
exports.actions = {
	cry: [ '😭 Cry', '**_0_** is now really sad _3_', 'cry', str.actions.cry ],
	sad: [ '😭 Sad', '**_0_** is now really sad _3_', 'sad', str.actions.sad ],
	happy: [ '😄 Happy', '**_0_** is really happy right now _3_', 'smile', str.actions.happy ],
	smile: [ '😄 Smile', '**_0_** is really happy right now _3_', 'smile', str.actions.smile ],
	pat: [ '✋ Pat', '**_0_** pats _3_', 'pat', str.actions.pat ],
	hug: [ '👐 Hug', '**_0_** hugs _3_', 'hug', str.actions.hug ],
	purr: [ '😻 Purr', '**_0_** purrs _3_', 'purr', str.actions.purr ],
	yes: [ '👍 Yes', '**_0_** thinks it\'s great _3_', 'yes', str.actions.yes ],
	no: [ '👎 No', '**_0_** thinks it\'s bad _3_', 'no', str.actions.no ],
	dance: [ '🕺 Dance', '**_0_** dances _3_', 'dance', str.actions.dance ],
	bite: [ '🤤 Bite', '**_0_** bites _3_', 'bite', str.actions.bite ],
	wave: [ '✋ Wave', '**_0_** waves _3_', 'wave', str.actions.wave ],
	bye: [ '✋ Bye', '**_0_** says goodbye _3_', 'wave', str.actions.bye ],
	cya: [ '✋ Cya', '**_0_** says goodbye _3_', 'wave', str.actions.bye ],
	kill: [ '🔪 Kill', '**_0_** wants to kill _3_', 'kill', str.actions.kill ],
	poke: [ '👉 Poke', '**_0_** pokes _3_', 'poke', str.actions.poke ],
	slap: [ '✋ slap', '**_0_** slaps _3_', 'slap', str.actions.slap ],
	punch: [ '👊 punch', '**_0_** punches _3_', 'punch', str.actions.punch ],
	die: [ '👻 Die', '**_0_** dies _3_', 'die', str.actions.die ],
	dead: [ '👻 Dead', '**_0_** dies _3_', 'die', str.actions.dead ],
	steal: [ '😈 Steal', '**_0_** want to steal _3_', 'steal', str.actions.steal ],
	run: [ '🏃 Run', '**_0_** want to run _3_', 'run', str.actions.run ],
	laugh: [ '🤣 Laugh', '**_0_** laughs _3_', 'laugh', str.actions.laugh ],
	shy: [ '😳 Shy', '**_0_** is shy _3_', 'shy', str.actions.shy ],
	sleep: [ '😴 Sleep', '**_0_** wants to sleep _3_', 'sleep', str.actions.sleep ],
	stare: [ '🤨 stare', '**_0_** stares _3_', 'stare', str.actions.stere ],
	glare: [ '😠 glare', '**_0_** glares _3_', 'glare', str.actions.glare ],
	kiss: [ '😙 kiss', '**_0_** want to kiss _3_', 'kiss', str.actions.kiss ],
	lick: [ '😛 lick', '**_0_** licks _3_', 'lick', str.actions.lick ],
	facepalm: [ '😒 Facepalm', '**_0_** facepalms _3_', 'facepalm', str.actions.facepalm ],
	pout: [ '😤 Pout', '**_0_** want to pout now _3_', 'pout', str.actions.pout ],
	greet: [ '✋ Greet', '**_0_** greets _3_', 'wave', str.common[0] ],
	shrug: [ '🤨 Shrug', '**_0_** shrugs _3_', 'shrug', str.actions.shrug ],
	clap: [ '👏 Clap', '**_0_** claps _3_', 'clap', str.actions.clap ],
	highfive: [ '✋ High five', '**_0_** highfives _3_', 'highfive', str.actions.highfive ],
	hi: [ '✋ Hi', '**_0_** says hi _3_', 'wave', str.actions.hi ],
	hey: [ '✋ Hey', '**_0_** says hey _3_', 'wave', str.actions.hey ],
	nervous: [ '😨 Nervous', '**_0_** is nervous _3_', 'nervous', str.actions.nervous ],
	catch: [ '😏 Catch', '**_0_** catching _3_', 'catch', str.actions.catch ],
	kick: [ '👠 kick', '**_0_** kicks _3_', 'kick', str.actions.kick ],
	cuddle: [ '😍 Cuddle', '**_0_** cuddles _3_', 'cuddle', str.actions.cuddle ]
}
