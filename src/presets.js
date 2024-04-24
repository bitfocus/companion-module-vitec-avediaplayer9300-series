const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	let presets = {}
	presets[`mute`] = {
		type: 'button',
		category: 'Audio',
		name: `Mute`,
		style: {
			text: `Mute`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'mute',
						options: {
							mute: false,
						},
					},
				],
				up: [],
			},
			{
				down: [
					{
						actionId: 'mute',
						options: {
							mute: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'mute',
				options: {},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	self.r9300.channelList.forEach((channel) => {
		presets[`setChannel_${channel.id}`] = {
			type: 'button',
			category: 'Set Channel',
			name: `${channel.label}`,
			style: {
				text: `${channel.label}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
				show_topbar: 'default',
			},
			steps: [
				{
					down: [
						{
							actionId: 'currentChannel',
							options: {
								uri: channel.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'currentChannel',
					options: {
						uri: channel.id,
					},
					style: {
						color: combineRgb(0, 0, 0),
						bgcolor: combineRgb(0, 204, 0),
					},
				},
			],
		}
	})
	self.setPresetDefinitions(presets)
}
