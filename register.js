const fs = require('fs');
const path = require('path');
const { createEmbedMessage, createErrorMessage } = require('./messageUtils');
const { getPlayers, savePlayers } = require('./dataManager');
const updateLeaderboard = require('./utils').updateLeaderboard;

module.exports = {
    name: 'register',
    description: 'Register as a new trader',
    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;

        let players = getPlayers();

        if (players[userId]) {
            players[userId].balance = 100000; // Reset balance if user already exists
        } else {
            players[userId] = {
                id: userId,
                username,
                balance: 100000
            };
        }

        savePlayers(players);

        const member = await interaction.guild.members.fetch(userId);
        const role = interaction.guild.roles.cache.find(role => role.name === 'Paper Trader');
        if (!role) {
            await interaction.reply({ embeds: [createErrorMessage('Paper Trader role not found.')] });
            return;
        }

        await member.roles.add(role);

        await interaction.reply({ embeds: [createEmbedMessage('Registration Complete', 'You have been registered as a Paper Trader and your balance has been set to 100000.')] });

        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'dg-announcements');
        if (logChannel) {
            await logChannel.send({ embeds: [createEmbedMessage('New Trader', `<@${userId}> has joined as a Paper Trader. Use /help to get started!`)] });
        }

        await updateLeaderboard(interaction.client, interaction.guild);
    }
};
