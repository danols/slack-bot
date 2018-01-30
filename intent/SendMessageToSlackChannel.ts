import BPromise = require('bluebird');

import { Intent } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';
import { Message } from '@maildots/sdk';

import { Util } from "../datasource/Util";

import { SlackDataSource } from "../datasource/SlackDataSource";
import { MongoDataSource } from "../datasource/MongoDataSource";
import { SDKDataSource } from "../datasource/SDKDataSource";

export class SendMessageToSlackChannel extends Intent<void>
{
  async execute(args: any)
  {
    let subject = args.Message.Subject
    let channel = subject.substring(subject.indexOf('#') + 1, subject.length)
    let email = args.Message.From.UserAddress
    let content = args.Message.Content
    let references = args.Message.References
    let channelData = await MongoDataSource.getChannel(channel);
    let user = await MongoDataSource.getUserInfo(email);
    var accessToken = ''
    user.teams.forEach((team) => {
      if ( team.team_id == channelData.team_id ) {
        accessToken = team.access_token;
        return;
      }
    })
    
    let slackDataSource = new SlackDataSource(accessToken);

    await slackDataSource.sendMessage(channelData.id,content);
    await MongoDataSource.setChannelReferences(email, channel, references);
  }

  static Args = class SendMessageToSlackChannelArgs implements Argument {
    message: Message;
  
    constructor(message: Message)
    {
      this.message = message;
    }
  
    get Message()
    {
      return this.message;
    }
  }
}
