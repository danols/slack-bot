import Promise = require('bluebird');
import * as Mongo from 'mongodb';
import * as dotenv from 'dotenv';

import { MongoRepository } from "../repository/MongoRepository";

dotenv.config({ path: ".env" });

class MongoDataSource implements MongoRepository 
{
	MongoClient;
	static Database;

	constructor()
	{
		this.MongoClient = Mongo.MongoClient;
	}

	init(callback)
	{
		this.MongoClient.connect(process.env.MONGO_URI, (err, database) => {
		  if (err) {
		  	callback(err)
		  	return
		  }
		  MongoDataSource.Database = database
			callback(null)
		})
	}

	static saveUserData(email, message_id): Promise<any>
	{
		return new Promise((resolve, reject) => {
			var user = {
				email: email,
				message_id: message_id,
				teams: []
			}
			MongoDataSource.Database.collection('users').insert(user, 
			(err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}

	static setUser(user): Promise<any> 
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('users').update(
				{ email : user.email },
				{ $set: { 
					id : user.id,
					username: user.username,
					access_token: user.access_token
				}
			}, (err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}

	static getUserInfo(email): Promise<any>  
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('users').findOne({email: email},
				(err, result) => {
					if (err) return reject(err)
					return resolve(result)
			})
		})
	}

	static addSlackUser(user): Promise<any>  
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('users').update(
				{ email : user.email },
				{ $push: {
					teams: {
						id : user.id,
						team_id: user.team_id,
						access_token: user.access_token
					}
				}
			}, (err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}

	static setChannelSync(email, channel, references): Promise<any>  
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('channels').update(
				{name: channel},
				{ $push: {
						accounts: {
							subscriber: email,
							references: references
						}
					}
				}, (err, result) => {
					if (err) return reject(err)
					return resolve(result)
				}
			)
		})
	}

	static setChannelReferences(email, channel, references): Promise<any>  
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('channels').update(
				{ 
					$and: [
						{name: channel}, 
						{'accounts.subscriber' : email}
					] 
				},
				{ $set: 
					{ 
						'accounts.$.references': references
					}
				}, (err, result) => {
					if (err) return reject(err)
					return resolve(result)
				}
			)
		})
	}

	
	static saveChannels(channels): Promise<any>  
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('channels').insertMany(channels, 
			(err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}

	static getChannel(name): Promise<any> 
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('channels').findOne({name: name}, (err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}

	static getChannelFromId(id): Promise<any> 
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('channels').findOne({id: id}, (err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}
}

export { MongoDataSource };