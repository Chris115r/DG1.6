const fs = require('fs');
const path = require('path');
const { createLeaderboardEmbed } = require('./messageUtils');
const { getPlayers } = require('./dataManager');

async function updateLeaderboard(client, guild) {
    const leaderboardFilePath = path.join(__dirname, 'leaderboardMessageId.json');

    const players = getPlayers();
    const sortedPlayers = Object.values(players).sort((a, b) => b.balance - a.balance);

    const embed = createLeaderboardEmbed(sortedPlayers, guild);

    let messageId;
    if (fs.existsSync(leaderboardFilePath)) {
        const leaderboardData = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf-8'));
        messageId = leaderboardData.messageId;
    }

    const leaderboardChannel = guild.channels.cache.find(channel => channel.name === 'leaderboard');
    if (!leaderboardChannel) {
        console.error('Leaderboard channel not found!');
        return;
    }

    try {
        let leaderboardMessage;
        if (messageId) {
            leaderboardMessage = await leaderboardChannel.messages.fetch(messageId);
            await leaderboardMessage.edit({ embeds: [embed] });
        } else {
            leaderboardMessage = await leaderboardChannel.send({ embeds: [embed] });
            fs.writeFileSync(leaderboardFilePath, JSON.stringify({ messageId: leaderboardMessage.id }, null, 2));
        }
    } catch (error) {
        console.error('Error fetching or editing leaderboard message:', error);
        const leaderboardMessage = await leaderboardChannel.send({ embeds: [embed] });
        fs.writeFileSync(leaderboardFilePath, JSON.stringify({ messageId: leaderboardMessage.id }, null, 2));
    }
}

module.exports = { updateLeaderboard };
