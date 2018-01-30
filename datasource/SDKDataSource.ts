import * as SDK from '@maildots/sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: ".env" });

import { SDKRepository } from "../repository/SDKRepository";

export class SDKDataSource implements SDKRepository
{
  sendingClient: SDK.SendingClient;

  constructor()
  {
    this.sendingClient = new SDK.SendingClient();
  }

  sendWelcomeMsg(to_address, state): Promise<any>
	{
		return new Promise(async (resolve) => {
			let to = new SDK.Contact(to_address)
			let content = 'Hi! my name is Slack-bot 🤖 \n\n I will help you to manage your slack account into Linkbox. \n\n To start, sync one team'
			let msg = new SDK.Message(content).setReceivers([to]).setSubject('Slack-bot')
			
			let auth_url = process.env.SLACK_AUTH_URL + state
      msg.setInputSet(new SDK.InputSet('log_in', [new SDK.WebView('Log In', auth_url)]).setType(SDK.InputSetType.InputKeyboard))
      
			let msgResult = await this.sendingClient.sendMessage(msg);
      return resolve(msgResult);
		})
	}

	sendNextSyncChannelMsg(refMsg, channels, content, email) 
	{
		return new Promise(async (resolve) => {
      let to = new SDK.Contact(email).setName('')
			let reponseMsg = new SDK.Message(content).setReceivers([to]).setSubject('Slack-bot')

      let options: any = {};
      
      channels.forEach(function (o) {
        options[o.name] = o.name;
      })

      reponseMsg.setInputSet(new SDK.InputSet('channels', [new SDK.ComboBox('Channels', options)]).setType(SDK.InputSetType.InputKeyboard))

      let msgResult = await this.sendingClient.sendReply(refMsg, reponseMsg);
      console.log(JSON.stringify(msgResult, null, 2))
      return resolve(msgResult);
		})
	}

	sendLoginMsg(address, state, content)
  {
    return new Promise(async (resolve) => {
      let to = new SDK.Contact(address);
      let msg = new SDK.Message(content).setReceivers([to]).setSubject('Slack-bot')
      let auth_url = process.env.SLACK_AUTH_URL + state
      
      msg.setInputSet(new SDK.InputSet('log_in', [new SDK.WebView('Log In', auth_url)]).setType(SDK.InputSetType.InputKeyboard))
      
      let msgResult = await this.sendingClient.sendMessage(msg);
      return resolve(msgResult);
    })
  }

  sendFirtsSyncRepoMsg(email, channels)
  {
    return new Promise(async (resolve) => {
      let content = 'Hi, again, \n you already have some teams saved, now sync a channel to continue.\n'
      let to = new SDK.Contact(email)
      let msg = new SDK.Message(content).setReceivers([to]).setSubject('Slack-bot')

      let options: any = {};
  
      channels.forEach(function (c) {
        c.channels.forEach(function (cc) {
          options[c.team + '/' + cc.name] = c.team + '/' + cc.name;
        })
      })

      msg.setInputSet(new SDK.InputSet('channels', [new SDK.ComboBox('Channels', options)]).setType(SDK.InputSetType.InputKeyboard))

      let msgResult = await this.sendingClient.sendMessage(msg);
      return resolve(msgResult);
    })
  }

  sendSyncAccountMsg(refMsg, state)
  {
    return new Promise(async (resolve) => {
      let content = "You don't have any team yet, please sync one slack team"
      let reponseMsg = new SDK.Message(content).setSubject('Slack-bot')

      let auth_url = process.env.SLACK_AUTH_URL + state
      reponseMsg.setInputSet(new SDK.InputSet('log_in', [new SDK.WebView('Log In', auth_url)]).setType(SDK.InputSetType.InputKeyboard))

      let msgResult = await this.sendingClient.sendReply(refMsg, reponseMsg);
      return resolve(msgResult);
    })
  }

  sendSyncChannelMsg(refMsg, channels)
  {
    return new Promise(async (resolve) => {
      let content = 'Select one channel to sync'
      let reponseMsg = new SDK.Message(content).setSubject('Slack-bot')

      let options: any = {};
  
      channels.forEach(function (c) {
        c.channels.forEach(function (cc) {
          options[c.team + '/' + cc.name] = c.team + '/' + cc.name;
        })
      })

      reponseMsg.setInputSet(new SDK.InputSet('channels', [new SDK.ComboBox('Channels', options)]).setType(SDK.InputSetType.InputKeyboard))
      let msgResult = await this.sendingClient.sendReply(refMsg, reponseMsg);
      return resolve(msgResult);
    })
  }

  sendNewMsgChannel(to_address, content, subject): Promise<any>
  {
    return new Promise(async (resolve) => {
      let to = new SDK.Contact(to_address)
      let msg = new SDK.Message(content).setReceivers([to]).setSubject(subject)
      
      let msgResult = await this.sendingClient.sendMessage(msg);
      return resolve(msgResult);
    })
  }

  replyMsgSuccess(refMsg, content) 
  {
    return new Promise(async (resolve) => {
      let reponseMsg = new SDK.Message(content).setSubject('Slack-bot')

      let msgResult = await this.sendingClient.sendReply(refMsg, reponseMsg);
      return resolve(msgResult);
    })
  }

  sendMessageFromSlack(email, from, text, channel, references)
  {
		return new Promise(async (resolve) => {
      let to = new SDK.Contact(email).setName('')
		  let content = '<b>@' + from + '</b> <br>' + text
		  let msg = new SDK.Message(content).setReceivers([to]).setSubject('[Channel] #' + channel).setReferences(references);
			let msgResult = await this.sendingClient.sendMessage(msg);
      return resolve(msgResult);
		})
  }
}
