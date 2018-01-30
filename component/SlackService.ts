import { Intent } from "@maildots/sdk";

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from "dotenv";

import { Util } from "../datasource/Util";

import { SignUp } from "../intent/SignUp";
import { NotifyMessage } from "../intent/NotifyMessage";

dotenv.config({ path: ".env" });

class SlackService
{
  app;
  port;

  index;

  constructor() 
  {
    this.port = process.env.PORT || '';
    this.app = express();

    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

    this.app.listen(this.port, (err) => this.onStartServer(err))

    this.app.get('/index', (req, res) => this.onRequestIndex(req, res));
    //Github
    this.app.post('/slack/events', (req, res) => this.onSlackEvent(req, res));
    this.app.get('/slack/auth', (req, res) => this.onSlackAuth(req, res));
  }

  onStartServer(err)
  {
    console.log("App listening on port " + this.port);
  }

  onRequestIndex(req, res)
  {
    res.sendStatus(200).end();
  }

  async onSlackEvent(req, res)
  {
    if (req.body.token == process.env.SLACK_VERIFICATION_TOKEN) {
      if (req.body.type == 'url_verification')
        res.status(200).json({'challenge':req.body.challenge}).end()    
      if (req.body.type == 'event_callback' && !req.body.event.subtype) {
        res.sendStatus(200).end();
        
        let notifyMessage = new NotifyMessage();
        let args = new NotifyMessage.Args(req.body.event);
        
        await notifyMessage.execute(args);
      }    
    } else {
      res.sendStatus(403).end();
    }
  }
  
  async onSlackAuth(req, res)
  {

    res.sendStatus(200).end();
    let email = Util.decrypt(req.query.state);
    let code = req.query.code;

    let signUp = new SignUp();
    let args = new SignUp.Args(email, code);
    await signUp.execute(args);
  }

}

export { SlackService };