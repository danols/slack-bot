import BPromise = require('bluebird');
import { Intent } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';

import { SlackDataSource } from "../datasource/SlackDataSource";
import { MongoDataSource } from "../datasource/MongoDataSource";
import { SDKDataSource } from "../datasource/SDKDataSource";

export class NotifyMessage extends Intent<void>
{

  constructor()
  {
    super();
  }
  
  async execute(args: any)
  {

    let linkboxSDK = new SDKDataSource()
    let data = args.EventData;

    let channel = await MongoDataSource.getChannelFromId(data.channel);

    BPromise.map(channel.accounts, async (account) => {
      let user = await MongoDataSource.getUserInfo(account.subscriber);
      var accessToken = '';
      var userId = 0;

      user.teams.forEach((team) => {
        if(channel.team_id == team.team_id) {
          accessToken = team.access_token;
          userId = team.id;
          return;
        }
      })

      let slackDataSource = new SlackDataSource(accessToken);
      let from = await slackDataSource.getUserInfo(data.user);

      if(userId != data.user) 
        return linkboxSDK.sendMessageFromSlack(account.subscriber, from.profile.display_name, data.text, channel.name, account.references);
      return {sent: false};
    }).then((msgData) => {})
  
  }

  static Args = class NotifyMessageArgs implements Argument {

    eventData;
  
    constructor(eventData)
    {
      this.eventData = eventData;
    }
  
    get EventData()
    {
      return this.eventData;
    }
  
  }
}
