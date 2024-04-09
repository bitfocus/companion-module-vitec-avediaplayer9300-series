module.exports = async function (self) {
	self.setVariableDefinitions([
		{ variableId: 'mode', name: 'Mode' },
		{ variableId: 'currentChannel', name: 'Current Channel URI' },
		{ variableId: 'currentChannelName', name: 'Current Channel Name' },
		{ variableId: 'currentChannelNumber', name: 'Current Channel Number' },
		{ variableId: 'volume', name: 'Volume' },
	])
}
