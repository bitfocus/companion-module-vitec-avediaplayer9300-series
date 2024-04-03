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
			callback: async ({ options }) => {
				if (self.axios === undefined) {
					return undefined
				}
				try {
					const response = await self.axios.post('', JSON.stringify({ params: { currentMode: options.mode } }))
					self.logResponse(response)
					self.getMode()
				} catch (error) {
					self.logError(error)
				}
			},
			subscribe: async () => {
				self.getMode()
			},
		},
		currentChannel: {
			name: 'Change Channel URI',
			options: [
				{
					id: 'uri',
					type: 'textinput',
					label: 'URI',
					default: '',
					regex: Regex.SOMETHING,
					useVariables: true,
					tooltip: 'Should be formatted similar to: udp://239.192.65.2:5000?hwchan=1',
				},
			],
			callback: async ({ options }) => {
				let uri = await self.parseVariablesInString(options.uri)
				if (self.axios === undefined || uri === undefined) {
					return undefined
				}
				try {
					const response = await self.axios.post('', JSON.stringify({ params: { currentChannel: uri } }))
					self.logResponse(response)
					self.getChannel()
				} catch (error) {
					self.logError(error)
				}
			},
			subscribe: async () => {
				self.getChannel()
			},
			learn: async (action) => {
				const newChannel = await self.getChannel()
				if (newChannel === undefined) {
					return undefined
				}
				return {
					...action.options,
					uri: newChannel,
				}
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
					isVisible: (options) => {
						return !options.useVar
					},
				},
				{
					id: 'volVar',
					type: 'textinput',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar
					},
					tooltip: 'Variable should return an integer between 0 and 40',
				},
				{
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
				},
			],
			callback: async ({ options }) => {
				if (self.axios === undefined) {
					return undefined
				}
				let vol = options.vol
				if (options.useVar) {
					vol = parseInt(await self.parseVariablesInString(options.volVar))
					if (isNaN(vol) || vol < 0 || vol > 40) {
						self.log('warn', `an out of range variable has been passed to action.volume: ${vol}`)
						return undefined
					}
				}
				try {
					const response = await self.axios.post('', JSON.stringify({ params: { volume: vol } }))
					self.logResponse(response)
					self.getVolume()
				} catch (error) {
					self.logError(error)
				}
			},
			subscribe: async () => {
				self.getVolume()
			},
			learn: async (action) => {
				const newVol = await self.getVolume()
				if (newVol === undefined) {
					return undefined
				}
				return {
					...action.options,
					vol: newVol,
				}
			},
		},
		volumeUp: {
			name: 'Volume Up',
			options: [],
			callback: async () => {
				if (self.axios === undefined) {
					return undefined
				}
				try {
					const response = await self.axios.post('', JSON.stringify({ params: { volumeup: 'volumeup' } }))
					self.logResponse(response)
				} catch (error) {
					self.logError(error)
				}
			},
		},
		volumeDown: {
			name: 'Volume Down',
			options: [],
			callback: async () => {
				if (self.axios === undefined) {
					return undefined
				}
				try {
					const response = await self.axios.post('', JSON.stringify({ params: { volumedown: 'volumedown' } }))
					self.logResponse(response)
					self.getVolume()
				} catch (error) {
					self.logError(error)
				}
			},
		},
		mute: {
			name: 'Mute',
			options: [
				{
					id: 'mute',
					type: 'checkbox',
					label: 'Mute',
					default: false,
				},
			],
			callback: async ({ options }) => {
				if (self.axios === undefined) {
					return undefined
				}
				try {
					const response = await self.axios.post('', JSON.stringify({ params: { mute: options.mute } }))
					self.logResponse(response)
					self.getMute()
				} catch (error) {
					self.logError(error)
				}
			},
			subscribe: async () => {
				self.getMute()
			},
		},
		teletext: {
			name: 'Teletext',
			options: [
				{
					id: 'teletext',
					type: 'checkbox',
					label: 'Teletext',
					default: false,
				},
			],
			callback: async ({ options }) => {
				if (self.axios === undefined) {
					return undefined
				}
				try {
					let msg = options.teletext ? 'on' : 'off'
					const response = await self.axios.post('', JSON.stringify({ params: { teletext: msg } }))
					self.logResponse(response)
					self.getTeletext()
				} catch (error) {
					self.logError(error)
				}
			},
			subscribe: async () => {
				self.getTeletext()
			},
		},
	})
}
