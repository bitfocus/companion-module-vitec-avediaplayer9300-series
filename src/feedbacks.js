import { combineRgb, Regex } from '@companion-module/base'
import { mode } from './choices.js'

export default async function (self) {
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
				const newMode = await self.queue.add(
					async () => {
						return await self.getMode()
					},
					{ priority: 1 },
				)
				if (newMode === undefined) {
					return undefined
				}
				return {
					...feedback.options,
					mode: newMode,
				}
			},
			subscribe: async () => {
				await self.queue.add(
					async () => {
						await self.getMode()
					},
					{ priority: 0 },
				)
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
				await self.queue.add(
					async () => {
						await self.getMute()
					},
					{ priority: 0 },
				)
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
				await self.queue.add(
					async () => {
						await self.getTeletext()
					},
					{ priority: 0 },
				)
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
				const newChannel = await self.queue.add(
					async () => {
						return await self.getChannel()
					},
					{ priority: 1 },
				)
				if (newChannel === undefined) {
					return undefined
				}
				return {
					...feedback.options,
					uri: newChannel,
				}
			},
			subscribe: async () => {
				self.queue.add(
					async () => {
						await self.getChannel()
					},
					{ priority: 0 },
				)
			},
		},
	})
}
