require('dotenv').config();
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');
const PaperTrading = require('./trading');
const trading = new PaperTrading();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,  // Add any other required intents here
    ],
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

if (!DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is not defined');
    process.exit(1);
}

if (!GUILD_ID) {
    console.error('GUILD_ID is not defined');
    process.exit(1);
}

client.login(DISCORD_TOKEN).catch(console.error);

client.once('ready', () => {
    console.log('Bot is online!');
    loadCommands();
    setInterval(() => {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (guild) {
            trading.updateLeaderboard(guild);
        }
    }, 60000); // Update every minute
});

function loadCommands() {
    client.commands = new Map();
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
        console.log(`Loaded command: ${command.data.name}`);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
