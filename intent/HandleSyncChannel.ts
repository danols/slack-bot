import { Intent, InputSet } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';
import { Message } from '@maildots/sdk';

import { SlackDataSource } from "../datasource/SlackDataSource";
import { MongoDataSource } from "../datasource/MongoDataSource";
import { SDKDataSource } from "../datasource/SDKDataSource";

export class HandleSyncChannel extends Intent<void>
{
  async execute(args: any)
  {
    let linkboxSDK = new SDKDataSource();
    let inputSet = args.InputSet;
    let message = args.Message;
    
    let channel_name = inputSet.input[0].value
    let subject = '[Channel] - #' + channel_name
    let content = '🤖 Here you can send and receive <b>#' + channel_name + '</b> channel messages'
    
    let msgData = await linkboxSDK.sendNewMsgChannel(message.AccountAddress, content, subject)
    
    await MongoDataSource.setChannelSync(message.AccountAddress, channel_name, [msgData.message_id])

    let successMsgData = await linkboxSDK.replyMsgSuccess(
      message,
      '<b>#'+ channel_name +'</b> channel was added successfully 🎉'
    );
		
  }

  static Args = class HandleSyncChannelArgs implements Argument {

    message: Message;
    inputSet: InputSet;
  
    constructor(message: Message, inputSet: InputSet)
    {
      this.message = message;
      this.inputSet = inputSet;
    }
  
    get InputSet()
    {
      return this.inputSet;
    }
    
    get Message()
    {
      return this.message;
    }
  
  }
  
}
