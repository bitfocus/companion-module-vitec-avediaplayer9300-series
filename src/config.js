const { Regex } = require('@companion-module/base')

module.exports = {
	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Host',
				width: 8,
				regex: Regex.HOSTNAME,
			},
			{
				type: 'textinput',
				id: 'user',
				label: 'Username',
				width: 4,
				regex: Regex.SOMETHING,
				default: 'admin',
			},
			{
				type: 'textinput',
				id: 'pass',
				label: 'Password',
				width: 4,
				regex: Regex.SOMETHING,
				default: 'labrador',
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Verbose Logging',
				width: 2,
				default: false,
				tooltip: 'Verbose logs written to the console',
			},
		]
	},
}
