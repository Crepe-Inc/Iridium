let chalk = require('chalk');

class Logger {
	constructor(name, color) {
		this.name = name;
		this.color = color || 'cyanBright';
		this.lastCommandLength = 0;
	}

	getName() {
		return chalk[this.color]('<' + this.name + '>');
	}
	updateLength(...msgs) {
		this.lastCommandLength = this.count(...msgs);
		// console.log(this.lastCommandLength)
	}
	count(...msgs) {
		return chalk.reset(this.getName()).length + chalk.reset([...msgs].join()).length - 40;
	}
	plain(...msgs) {
		console.log(
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	log(...msgs) {
		console.log(
			'        ',
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	warn(...msgs) {
		console.warn(
			chalk.yellow(`[ WARN ]`),
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	error(...msgs) {
		console.warn(
			chalk.red(`[ ERR ] `),
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	debug(...msgs) {
		console.warn(
			chalk.dim(`[ DBG ] `),
			this.getName(),
			chalk.dim(...msgs)
		)
		this.updateLength(...msgs);
		return this;
	}
	start(...msgs) {
		console.warn(
			chalk.green(`[  ▶  ] `),
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	stop(...msgs) {
		console.warn(
			chalk.redBright(`[  ◼  ] `),
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	refresh(...msgs) {
		console.warn(
			chalk.cyan(`[  ↺  ] `),
			this.getName(),
			...msgs
		)
		this.updateLength(...msgs);
		return this;
	}
	trail(...msgs) {
		process.stdout.write(' '.repeat(this.lastCommandLength) + "\x1B[1A" +chalk.dim(msgs.join(' ').substr(0,process.stdout.columns - 24 - this.count(msgs))));
		console.log('');
		return this;
	}	
}

// let l = new Logger('service', 'redBright');
// Object.getOwnPropertyNames( Logger.prototype ).forEach((prop) => {
// 	if(prop == 'constructor') return;
// 	l[prop]('I am testing', 'so many messages now ahahahaha hahah')
// })

module.exports = Logger;