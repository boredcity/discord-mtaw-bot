# Discord bot for "Mage: the Awakening" (2nd Edition)

A bot that allows you to:
- calculate spell parameters for Mage: the Awakening (2nd edition)
- roll d10 dice

Heavily inspired by this website: http://www.voidstate.com/rpg/mage-spell-helper/ 

Uses list of spells from http://wodcodex.com/wiki/Spells,_All_(2nd_Edition)

## Available Slash Commands

### Spell Casting
- `/cast_improvised` -- calculates dice, reach and mana needed to cast an improvised spell or Praxis
- `/cast_rote` -- calculates dice, reach and mana needed to cast a Rote
- `/lookup_rote` -- get a Rote description by its name or Arcana + Level (i.e. `life4`)

### Dice rolls
- `/chance` -- rolls a single d10 chance die
- `/roll` -- rolls d10s; you can choose reroll/explosion rule
- `/r` -- shorthand for `roll {number} 10_again`: rolls d10s with 10again rule

### Other
- `/ping` -- ping server
- `/help` -- shows a list of available commands

### Why not use the website above instead?

1. You should use it if it's convenient to you! It's just our group was using Discord for video communication anyway so it made more sense to stick with a single app.

2. there is a small added benefit of Storyteller being able to view the spell parameters right away and spot mistakes / figure out the spell potency / etc. without asking a player.

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

The slash commands will work as long as you leave the terminal with `npm run dev` command running open.

## Adding or removing commands

After you add or remove command, you have to use `npm run deploy-commands` -- this way the server will update the slash commands list

## Languages

Right now the bot answers in English. There are a few commands crudely translated to Russian.

## TODO:
- [ ] scalable i18n
- [ ] easier setup
- [ ] proof reading through the spell descriptions and tightening the types
- [ ] actually hosting the bot and using it beyond a single guild