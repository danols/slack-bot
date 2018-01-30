import { Intent } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';
import { LogClient } from '@maildots/sdk';

import Request = require('request');
import * as dotenv from 'dotenv';

import { Util } from "../datasource/Util";

import { SlackDataSource } from "../datasource/SlackDataSource";
import { MongoDataSource } from "../datasource/MongoDataSource";
import { SDKDataSource } from "../datasource/SDKDataSource";

dotenv.config({ path: ".env" });

export class SignUp extends Intent<void>
{
  async execute(args: any)
  {
    let linkboxSDK = new SDKDataSource()
    let logClient = new LogClient()
    var references;

    let authInfo = await this.sendAuthRequestToSlack(args.Code);
    
    let access_token = authInfo.access_token;

    let slackDataSource = new SlackDataSource(access_token);
		
    let channels = await slackDataSource.getChannels()

    let team = await slackDataSource.getTeamInfo();

    var db_channels = channels.map((channel) => {
      return {
        id: channel.id,
        name: team.name + '/' + channel.name,
        team_id: authInfo.team_id,
        accounts: []
      }
    })

    let slackUser = {
      id: authInfo.user_id,
      team_id: authInfo.team_id,
      email: args.Email,
      access_token: access_token
    }

    await MongoDataSource.addSlackUser(slackUser);
    await MongoDataSource.saveChannels(db_channels);

    let userdb = await MongoDataSource.getUserInfo(args.Email)

    references = [userdb.message_id];
    let refMessages = await logClient.getThread(args.Email, userdb.message_id)
    
    let msgData = await linkboxSDK.sendNextSyncChannelMsg(
      refMessages[refMessages.length - 1],
      db_channels,
      '🔹 <b>' + authInfo.team_name + '</b> team was added successfully 🎉 <br><br> Now, choose a channel to sync',
      args.Email
    )
  }

  sendAuthRequestToSlack(code): Promise<any>
  {
    return new Promise((resolve, reject) => {
			var data = 
			{
				form: {
					client_id: process.env.SLACK_CLIENT_ID,
					client_secret: process.env.SLACK_CLIENT_SECRET,
					code: code
				}
			}
			Request.post('https://slack.com/api/oauth.access', data, (err, res, result) => {
				if (err) return reject(err)
				return resolve(JSON.parse(result))
			})

		})
  }

  static Args = class SignUpArgs implements Argument {

    private email: string;
    private code: string;
  
    constructor(email: string, code: string) 
    {
      this.email = email;
      this.code = code;
    }
  
    get Email()
    {
      return this.email;
    }
  
    get Code()
    {
      return this.code;
    }
  }
}