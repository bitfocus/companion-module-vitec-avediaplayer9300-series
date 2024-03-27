module.exports = async function (self) {
	self.setVariableDefinitions([
		{ variableId: 'mode', name: 'Mode' },
		{ variableId: 'currentChannel', name: 'Current Channel URI' },
		{ variableId: 'volume', name: 'Volume' },
	])
}
