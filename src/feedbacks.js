const { combineRgb, Regex } = require('@companion-module/base')
const { mode } = require('./choices')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		currentMode: {
			name: 'Mode',
			type: 'boolean',
			label: 'Current device mode',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'av',
					choices: mode,
				},
			],
			callback: (feedback) => {
				return feedback.options.mode === self.r9300.mode
			},
			learn: async (feedback) => {
				const newMode = await self.getMode()
				if (newMode === undefined) {
					return undefined
				}
				return {
					...feedback.options,
					mode: newMode,
				}
			},
			subscribe: async () => {
				self.getMode()
			},
		},
		mute: {
			name: 'Mute',
			type: 'boolean',
			label: '',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => {
				return self.r9300.mute
			},
			subscribe: async () => {
				self.getMute()
			},
		},
		teletext: {
			name: 'Teletext',
			type: 'boolean',
			label: '',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => {
				return self.r9300.teletext
			},
			subscribe: async () => {
				self.getTeletext()
			},
		},
		currentChannel: {
			name: 'Current Channel',
			type: 'boolean',
			label: 'Current Channel URI',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'uri',
					type: 'dropdown',
					label: 'URI',
					choices: self.r9300.channelList,
					default: '',
					regex: Regex.SOMETHING,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Should be formatted similar to: udp://239.192.65.2:5000?hwchan=1',
				},
			],
			callback: async (feedback, context) => {
				const uri = await context.parseVariablesInString(feedback.options.uri)
				return uri == self.r9300.uri
			},
			learn: async (feedback) => {
				const newChannel = await self.getChannel()
				if (newChannel === undefined) {
					return undefined
				}
				return {
					...feedback.options,
					uri: newChannel,
				}
			},
			subscribe: async () => {
				self.getChannel()
			},
		},
	})
}
