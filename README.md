![Maildots](logo.png)

Maildots is a cross-platform app designed to streamline the communication via e-mail and optimize the management and functionality of this medium
This repository holds the source code for the **Node-sdk** version of Maildots written mainly in Javascript

## Features

* **Fast:** Maildots is significantly faster than even dedicated e-mails servers, thanks to a new paradigm of communication between devices with Maildots installed.

* **Modern:** Maildots offers an innovative interface, which mix the robust functionality of e-mail with the simplicity of a message application.

* **Usefull:** Maildots expands the e-mail potencial, introducing new functions like control version for attachments, task manager and e-mail schedule.

* **Collaborative:** By first time, Maildots allows the user to work in team without having to move to another platform.


## Build and code Maildots-node-sdk


Prerequisites:

 * Download the [**Node-js 6.11.1 or later**](https://nodejs.org/es/download/) and install it.

To start coding and build

 * Clone this repository
 
  * Log in npm maildots acccount
  
     user: maildots
   
     password: jajatl@dano-bot
   
     email: dev@maildots.com

 ```bash
 maildots-mock-bot$ npm login
 ```

 * Install dependencies

 ```bash
 maildots-mock-bot$ npm install
 ```
 
  * Create .env file with your bot data

 ```
 ACCOUNT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
 BOT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
 BOT_ACCOUNT_CHANNEL=private-xxxxxxxxxx
 BOT_CHANNEL=private-xxxxxxxxxxxxx
 BOT_NAME=Dano-Bot
 BOT_ADDRESS=danobot@maildots.com
 ```
 
 * Run project

 ```bash
 maildots-mock-bot$ node index.js
 ```
## Deploy on Heroku

Prerequisites:

 * Sign up [Heroku](https://signup.heroku.com/login)
 * Intall [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
 
 
 * Check NPM_TOKEN

 ```bash
 maildots-mock-bot$ nano ~/.npmrc
 ```
 
 * Set NPM_TOKEN env

 ```bash
 maildots-mock-bot$ export NPM_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX
 ```
 
 * Refresh terminal

 ```bash
 maildots-mock-bot$ source ~/.bash_profile
 ```
 
  * Create .npmrc file with NPM_TOKEN in the root of your project

 ```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
 ```
 
To Deploy

 * Log In
 ```bash
 maildots-mock-bot$ heroku login
 ```
 
 * Create a project
 ```bash
 maildots-mock-bot$ heroku create maildots-dano-bot
 ```
 
 * Define config vars
 ```bash
 maildots-mock-bot$ heroku config:set ACCOUNT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
 maildots-mock-bot$ heroku config:set BOT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
 maildots-mock-bot$ heroku config:set BOT_ACCOUNT_CHANNEL=private-xxxxxxxxxx
 maildots-mock-bot$ heroku config:set BOT_CHANNEL=private-xxxxxxxxxxxxx
 maildots-mock-bot$ heroku config:set BOT_NAME=Dano-Bot
 maildots-mock-bot$ heroku config:set BOT_ADDRESS=danobot@maildots.com
 maildots-mock-bot$ heroku config:set NPM_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX
 ```
 
 * Deploy your code
 ```bash
 maildots-mock-bot$ git push heroku master
 ```
 
 * Config your app
 ```bash
 maildots-mock-bot$ heroku ps:scale web=0 worker=1
 ```
 
 * Monitor your app
 ```bash
 maildots-mock-bot$ heroku logs --tail
 ```
