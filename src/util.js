module.exports = {
	async getMode() {
		let varList
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?currentMode=true')
			this.logResponse(response)
			if (response.data.currentMode.value === undefined) {
				this.log('warn', 'getMode response contains no data')
				return undefined
			}
			this.r9300.mode = response.data.currentMode.value
			varList['mode'] = this.r9300.mode
			this.setVarliableValues(varList)
		} catch (error) {
			this.logError(error)
		}
	},
	async getChannel() {
		let varList
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?currentChannel=true')
			this.logResponse(response)
			if (response.data.currentChannel === undefined) {
				this.log('warn', 'getMode response contains no data')
				return undefined
			}
			this.r9300.uri = response.data.currentChannel
			varList['currentChannel'] = this.r9300.uri
			this.setVarliableValues(varList)
		} catch (error) {
			this.logError(error)
		}
	},
}
