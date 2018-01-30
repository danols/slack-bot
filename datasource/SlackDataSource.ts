import Promise = require('bluebird');
import * as SlackClient from '@slack/client';

class SlackDataSource 
{

	slack;

	constructor(slackToken) 
	{
		let WebClient = SlackClient.WebClient;
		this.slack = new WebClient(slackToken);
	}

	sendMessage(channelId, content): Promise
	{
		return new Promise((resolve, reject) => {
			this.slack.chat.postMessage(channelId, content, true, function (err, msgData) {
				if (err) return reject(err);
				return resolve(msgData);
			})
		})
	}

	getTeamInfo(): Promise
	{
		return new Promise((resolve, reject) => {
			this.slack.team.info(function (err, teamInfo) {
				if (err) return reject(err);
				return resolve(teamInfo.team);
			})
		})
	}

	getChannels(): Promise
	{
		return new Promise((resolve, reject) => {
			this.slack.channels.list(function (err, res) {
				if (err) return reject(err);
				return resolve(res.channels);
			})
		})
	}

	getTeamUsers(): Promise
	{
		return new Promise((resolve, reject) => {
			this.slack.users.list(function (err, users) {
				if (err) return reject(err);
				return resolve(users);
			})
		})
	}

	getUserInfo(id): Promise
	{
		return new Promise((resolve, reject) => {
			this.slack.users.info(id, function (err, user) {
				if (err) return reject(err);
				return resolve(user.user);
			})
		})
	}
}

export { SlackDataSource };