import { load } from 'ts-dotenv'

export const envs = load({
    BOT_TOKEN: String,
    APP_ID: String,
    PUB_KEY: String,
    GUILD_ID: String,
    NODE_ENV: {
        type: ['production', 'development'],
        default: 'production',
    },
})
