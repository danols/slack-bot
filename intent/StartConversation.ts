import BPromise = require('bluebird');

import { Intent } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';
import { Util } from "../datasource/Util";

import { SlackDataSource } from "../datasource/SlackDataSource";
import { MongoDataSource } from "../datasource/MongoDataSource";
import { SDKDataSource } from "../datasource/SDKDataSource";

export class StartConversation extends Intent<void>
{

  async execute(args: any)
  {
    let linkboxSDK = new SDKDataSource()
    let userAddress = args.UserAddress;

    let user = await MongoDataSource.getUserInfo(userAddress);
    if(user) {
      if(user.teams.length == 0) {
        let msgData = await linkboxSDK.sendLoginMsg(
          userAddress, 
          Util.encrypt(userAddress),
          'Hi again! to start sync one slack team\n'
        )
      } else {
        BPromise.map(user.teams,async (team) => {
          let slackDataSource = new SlackDataSource(team.access_token);
          let channels = await slackDataSource.getChannels();
          let teamInfo = await slackDataSource.getTeamInfo();

          return {
            team: teamInfo.name,
            channels: channels
          }
        }).then((channels) => {
          let msgData = linkboxSDK.sendFirtsSyncRepoMsg(userAddress, [].concat(...channels)) 
        })
      }
    } else {
      //It's a new user
      let msgData = await linkboxSDK.sendWelcomeMsg
      (
        userAddress, 
        Util.encrypt(userAddress)
      );
      await MongoDataSource.saveUserData(userAddress,msgData.message_id);
    }
  }

  static Args = class StartConversationArgs implements Argument {

    user_address: string;
  
    constructor(user_address: string) 
    {
      this.user_address = user_address;
    }
  
    get UserAddress()
    {
      return this.user_address;
    }
  }
}
