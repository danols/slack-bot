import BPromise = require('bluebird');

import { Intent } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';
import { Message } from '@maildots/sdk';

import { Util } from "../datasource/Util";

import { SlackDataSource } from "../datasource/SlackDataSource";
import { MongoDataSource } from "../datasource/MongoDataSource";
import { SDKDataSource } from "../datasource/SDKDataSource";

export class SendChannelForm extends Intent<void>
{
  async execute(args: any)
  {
    let linkboxSDK = new SDKDataSource()
    let user = await MongoDataSource.getUserInfo(args.Message.AccountAddress);

    if(user.teams.length == 0) {
      let msgData = linkboxSDK.sendSyncAccountMsg(
        args.Message, 
        Util.encrypt(args.Message.AccountAddress)
      );
    } else {
      BPromise.map(user.teams, async (team) => {
        let slackDataSource = new SlackDataSource(team.access_token);
        let channels = await slackDataSource.getChannels();
        let teamInfo = await slackDataSource.getTeamInfo();

        return {
          team: teamInfo.name,
          channels: channels
        }
      }).then((channels) => {
        let msgData = linkboxSDK.sendSyncChannelMsg(args.Message, [].concat(...channels))
      })  
    }
  }

  static Args = class SendChannelFormArgs implements Argument {
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
