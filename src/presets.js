const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	let presets = {}
	presets[`mute`] = {
		type: 'button',
		category: 'Audio',
		name: `Mute`,
		style: {
			text: `Volume: $(generic-module:volume)\\nMute`,
			size: '14',
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
							mute: true,
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
							mute: false,
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
	presets[`volume_down`] = {
		type: 'button',
		category: 'Audio',
		name: `Volume Down`,
		style: {
			text: `-`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'volumeDown',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`volume_up`] = {
		type: 'button',
		category: 'Audio',
		name: `Volume Up`,
		style: {
			text: `+`,
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'volumeUp',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`mode_off`] = {
		type: 'button',
		category: 'Mode',
		name: `Off`,
		style: {
			text: `Off`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'currentMode',
						options: {
							mode: 'off',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'currentMode',
				options: {
					mode: 'off',
				},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(255, 0, 0),
				},
			},
		],
	}
	presets[`mode_av`] = {
		type: 'button',
		category: 'Mode',
		name: `AV`,
		style: {
			text: `AV`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'currentMode',
						options: {
							mode: 'av',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'currentMode',
				options: {
					mode: 'av',
				},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
		],
	}
	presets[`mode_browser`] = {
		type: 'button',
		category: 'Mode',
		name: `Browser`,
		style: {
			text: `Browser`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'currentMode',
						options: {
							mode: 'browser',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'currentMode',
				options: {
					mode: 'browser',
				},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
		],
	}
	presets[`mode_splash`] = {
		type: 'button',
		category: 'Mode',
		name: `Splash`,
		style: {
			text: `Splash`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'currentMode',
						options: {
							mode: 'splash',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'currentMode',
				options: {
					mode: 'splash',
				},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(0, 204, 0),
				},
			},
		],
	}
	presets[`mode_signage`] = {
		type: 'button',
		category: 'Mode',
		name: `Signage`,
		style: {
			text: `Signage`,
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
			show_topbar: 'default',
		},
		steps: [
			{
				down: [
					{
						actionId: 'currentMode',
						options: {
							mode: 'signage',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'currentMode',
				options: {
					mode: 'signage',
				},
				style: {
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(0, 204, 0),
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
