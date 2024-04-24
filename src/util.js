module.exports = {
	async getMode() {
		let varList = []
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
			this.checkFeedbacks('currentMode')
			this.setVariableValues(varList)
			return this.r9300.mode
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getChannel() {
		let varList = []
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?currentChannel=true')
			this.logResponse(response)
			if (response.data.currentChannel === undefined) {
				this.log('warn', 'getChannel response contains no data')
				return undefined
			}
			this.r9300.uri = response.data.currentChannel
			varList['currentChannel'] = this.r9300.uri
			this.checkFeedbacks('currentChannel')
			this.setVariableValues(varList)
			return this.r9300.uri
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getVolume() {
		let varList = []
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?volume=true')
			this.logResponse(response)
			if (response.data.volume === undefined) {
				this.log('warn', 'getVolume response contains no data')
				return undefined
			}
			this.r9300.volume = parseInt(response.data.volume)
			varList['volume'] = this.r9300.volume
			this.setVariableValues(varList)
			return this.r9300.volume
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getMute() {
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?mute=true')
			this.logResponse(response)
			if (response.data.mute === undefined) {
				this.log('warn', 'getMute response contains no data')
				return undefined
			}
			this.r9300.mute = !!response.data.mute
			this.checkFeedbacks('mute')
			return this.r9300.mute
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getTeletext() {
		if (this.axios === undefined) {
			return undefined
		}
		try {
			const response = await this.axios.get('?teletext=true')
			this.logResponse(response)
			if (response.data.teletext === undefined) {
				this.log('warn', 'getTeletext response contains no data')
				return undefined
			}
			this.r9300.teletext = response.data.teletext == 'on' ? true : false
			this.checkFeedbacks('teletext')
			return this.r9300.teletext
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},
	async getChannelList() {
		if (this.axios === undefined) {
			return undefined
		}
		try {
			let channelList = []
			let channelArray = []
			let newChannelList = []
			const response = await this.axios.get('?channels=true')
			this.logResponse(response)
			if (response.data.channels === undefined) {
				this.log('warn', 'getChannelList response contains no data')
				return undefined
			}
			if (Array.isArray(response.data.channels) === false) {
				this.log('warn', `getChannelList response contains unexpected data format ${response.data.channels.toString()}`)
				return undefined
			}
			channelList = response.data.channels
			channelList.forEach((channel) => {
				channelArray[channel[1]] = channel
				if (
					channel[3] === this.r9300.uri &&
					(this.r9300.channelName !== channel[2] || this.r9300.channelNumber !== channel[1])
				) {
					let varList = []
					if (this.config.verbose) {
						this.log('debug', `Updating Channel Name: ${channel[2]} and Number: ${channel[1]} variables`)
					}
					this.r9300.channelName = channel[2]
					this.r9300.channelNumber = channel[1]
					varList['currentChannelName'] = this.r9300.channelName
					varList['currentChannelNumber'] = this.r9300.channelNumber
					this.setVariableValues(varList)
				}
			})
			channelArray.forEach((channel) => {
				newChannelList.push({ id: channel[3], label: `${channel[1]}: ${channel[2]} (${channel[4]})` })
			})
			return newChannelList
		} catch (error) {
			this.logError(error)
			return undefined
		}
	},

	async updateChannelList() {
		let channelList = await this.getChannelList()
		if (channelList === undefined) {
			this.log('warn', 'No Channel List Available')
			return undefined
		}
		if (this.config.verbose) {
			this.log('debug', `Updating channel list for actions & feedbacks`)
		}
		this.r9300.channelList = channelList
		this.updateActions()
		this.updateFeedbacks()
		this.updatePresetsDefinitions()
	},
}
