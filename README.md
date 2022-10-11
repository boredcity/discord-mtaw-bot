# Discord bot for "Mage: the Awakening" (2nd Edition)

Allows to calculate spell parameters similar to http://www.voidstate.com/rpg/mage-spell-helper/ (but with less required steps) and also has a simple dice roller

Uses list of spells from http://wodcodex.com/wiki/Spells,_All_(2nd_Edition)

## How to run the bot locally
(it will work for everyone on your discord server!)

1. Install `Node.JS` and `NPM` using this guide (if you don't have them already): https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

1. Install `git` using this guide (if you don't have it already): https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

1. Choose a folder for this code to be stored in and copy this repo to your machine with `git clone https://github.com/boredcity/discord-mtaw-bot.git`

1. Navigate to the folder and run `npm ci` in the terminal to install all the dependencies

1. Create a new application using this guide: https://www.writebots.com/discord-bot-token/

1. Create `.env` file inside of the cloned project folder with the the following text inside (replacing `[text]` with the actual values; if you have trouble finding all the variables, use the guild from the previous step):

```
BOT_TOKEN=[copy from Application's "Bot" tab]

APP_ID=[copy from Application's "General Information" tab]

PUB_KEY=[copy from Application's "General Information" tab]

GUILD_ID=[copy from url https://discord.com/channels/<GuildID_YOU_NEED_THIS_PART>/<ChannelID>]

NODE_ENV=["production" or "development", affects only the logging amount]
```

1. run `npm run dev` to start the bot in development mode

1. invite the bot to your channel (Application tab "Oauth 2" -> "Url generator"; select scope "bot" and bot permissions "Send Messages" + "Use slash commands" from the list) and copy the url to the browser.

## Slash Commands:

`/cast_improvised`

calculates dice, reach and mana needed to cast an improvised spell or Praxis

`/cast_rote`

calculates dice, reach and mana needed to cast a Rote

`/chance`

rolls a single d10 chance die

`/help`

shows a list of available commands

`/ping`

ping server

`/r`

rolls d10s with 10again rule

`/roll`

rolls d10s; you can choose reroll/explosion rule

## Adding or removing commands

After you add or remove command, you have to use `npm run deploy-commands` -- this way the server will update the slash commands list

## Languages

Right now the bot answers in English. There are a few commands crudely translated to Russian.

## TODO:
- [ ] scalable i18n
- [ ] easier setup
- [ ] proof reading through the spell descriptions and tightening the types
- [ ] actually hosting the bot and using it beyond a single guild