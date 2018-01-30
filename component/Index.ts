import { BaseComponent } from "@maildots/sdk";
import { Intent } from "@maildots/sdk";
import { Message } from "@maildots/sdk";
import { InputSet } from "@maildots/sdk";

import { StartConversation } from "../intent/StartConversation";
import { HandleSyncChannel } from "../intent/HandleSyncChannel";
import { SendChannelForm } from "../intent/SendChannelForm";
import { SendMessageToSlackChannel } from "../intent/SendMessageToSlackChannel";

export class Index extends BaseComponent
{
  constructor()
	{
		super();
	}

	async onNewMessage(message: Message) 
	{
		console.log("ON NEW MESSAGE")
		let sendMessageToSlackChannel = new SendMessageToSlackChannel();
    let args = new SendMessageToSlackChannel.Args(message);
		await sendMessageToSlackChannel.execute(args);
	}

	async onInstall(accountAddress: string) 
	{
		console.log("ON NEW INSTALL");
		let startConversation = new StartConversation();
    let args = new StartConversation.Args(accountAddress);
    await startConversation.execute(args);
	}

	async onUninstall(accountAddress: string)
	{
		console.log("ON NEW UNINSTALL");
	}

	async onCommand(command: string, message: Message) 
	{
		console.log("ON NEW COMMAND")
		switch(command) {
			case '/Sync-channel':
				let sendChannelForm = new SendChannelForm();
				let args = new SendChannelForm.Args(message);
				await sendChannelForm.execute(args);
      break
      default:
    }
	}

	async onCall(command: string, message: Message)
	{
		console.log("ON NEW ONCALL")
		console.log(command)
		console.log(JSON.stringify(message, null, 2))
	}

	async onInteraction(message: Message, inputSet: any)
	{
		//console.log("ON NEW INTERACTION")
		//console.log(JSON.stringify(message, null, 2))
		//console.log(inputSet, null, 2)
		switch (inputSet.Id) {
			case 'channels':
				let args = new HandleSyncChannel.Args(message, inputSet);
				let handleSyncChannel = new HandleSyncChannel();
				await handleSyncChannel.execute(args);
      break;
      default:
        console.log("Unknown Interaction");
      break;
		}
	}
}
