const { Regex } = require('@companion-module/base')
const { mode } = require('./choices')

module.exports = function (self) {
	self.setActionDefinitions({
		currentMode: {
			name: 'Change Mode',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'av',
					choices: mode,
					allowCustom: true,
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
		currentChannel: {
			name: 'Change Channel URI',
			options: [
				{
					id: 'num',
					type: 'textinput',
					label: 'URI',
					default: '',
					regex: Regex.SOMETHING,
					useVariables: true,
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
		volume: {
			name: 'Change Volume',
			options: [
				{
					id: 'vol',
					type: 'number',
					label: 'Volume',
					default: 30,
					min: 0,
					max: 40,
					range: true,
					step: 1,
				},
			],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
		volumeUp: {
			name: 'Volume Up',
			options: [],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
		volumeDown: {
			name: 'Volume Down',
			options: [],
			callback: async (event) => {
				console.log('Hello world!', event.options.num)
			},
		},
	})
}
