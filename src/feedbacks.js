const { combineRgb } = require('@companion-module/base')
const { mode } = require('./choices')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		currentMode: {
			name: 'Device Mode',
			type: 'boolean',
			label: 'Current device mode.',
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
				if (feedback.options.mode === self.r9300.mode) {
					return true
				} else {
					return false
				}
			},
		},
	})
}
