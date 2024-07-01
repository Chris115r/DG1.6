// messageUtils.js
const { EmbedBuilder } = require('discord.js');

function createEmbedMessage(title, description, color = '#FFD700') {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

function createLeaderboardEmbed(players, guild) {
    let leaderboardText = '';
    players.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const playerName = guild.members.cache.get(player.id)?.user.username || 'Unknown';
        leaderboardText += `${medal} ${playerName} - ${player.balance}\n`;
    });

    return new EmbedBuilder()
        .setColor('#FFD700') // Gold color
        .setTitle('Leaderboard')
        .setDescription(leaderboardText)
        .setTimestamp();
}

function createErrorMessage(description) {
    return new EmbedBuilder()
        .setTitle('Error')
        .setDescription(description)
        .setColor('#FF0000') // Red color for errors
        .setTimestamp();
}

module.exports = {
    createEmbedMessage,
    createLeaderboardEmbed,
    createErrorMessage
};
