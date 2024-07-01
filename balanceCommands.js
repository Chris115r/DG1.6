// balanceCommands.js
const fs = require('fs');
const path = require('path');
const { createEmbedMessage, createErrorMessage } = require('./messageUtils');
const playersFilePath = path.join(__dirname, 'players.json');
const updateLeaderboard = require('./utils').updateLeaderboard;

function getBalance(interaction) {
    const userId = interaction.user.id;
    const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf8'));

    if (!players[userId]) {
        return interaction.reply({ embeds: [createErrorMessage('You are not registered yet.')] });
    }

    const balance = players[userId].balance;
    interaction.reply({ embeds: [createEmbedMessage('Your Balance', `Your balance is ${balance}.`)] });
}

function editBalance(interaction) {
    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf8'));

    if (!players[targetUser.id]) {
        return interaction.reply({ embeds: [createErrorMessage('The specified user is not registered.')] });
    }

    players[targetUser.id].balance += amount;
    fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));

    interaction.reply({ embeds: [createEmbedMessage('Balance Updated', `${targetUser.username}'s balance has been updated to ${players[targetUser.id].balance}.`)] });

    const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'profit-allocation');
    if (logChannel) {
        logChannel.send(`${targetUser.username}'s balance was adjusted by ${amount}. New balance: ${players[targetUser.id].balance}`);
    }

    updateLeaderboard(interaction.client, interaction.guild);
}

module.exports = {
    getBalance,
    editBalance
};
