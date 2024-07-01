// tradeCommands.js
const fs = require('fs');
const path = require('path');
const { createEmbedMessage, createErrorMessage } = require('./messageUtils');
const tradesFilePath = path.join(__dirname, 'trades.json');
const playersFilePath = path.join(__dirname, 'players.json');

function getHoldings(interaction) {
    const userId = interaction.user.id;
    const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf8'));
    const trades = JSON.parse(fs.readFileSync(tradesFilePath, 'utf8'));

    if (!players[userId]) {
        return interaction.reply({ embeds: [createErrorMessage('You are not registered yet.')] });
    }

    const holdings = trades.filter(trade => trade.userId === userId && trade.status === 'open');
    if (holdings.length === 0) {
        return interaction.reply({ embeds: [createErrorMessage('You have no current holdings.')] });
    }

    let holdingsText = '';
    holdings.forEach(holding => {
        holdingsText += `${holding.symbol}: ${holding.amount} shares\n`;
    });

    interaction.reply({ embeds: [createEmbedMessage('Your Holdings', holdingsText)] });
}

function showTrade(interaction) {
    const tradeId = interaction.options.getString('trade_id');
    const userId = interaction.user.id;
    const trades = JSON.parse(fs.readFileSync(tradesFilePath, 'utf8'));

    const trade = trades.find(trade => trade.id === tradeId && trade.userId === userId);
    if (!trade) {
        return interaction.reply({ embeds: [createErrorMessage('Trade not found or you do not have permission to view this trade.')] });
    }

    const tradeDetails = `
    **Trade ID**: ${trade.id}
    **Symbol**: ${trade.symbol}
    **Type**: ${trade.type}
    **Amount**: ${trade.amount}
    **Status**: ${trade.status}
    **Timestamp**: ${trade.timestamp}
    `;

    interaction.reply({ embeds: [createEmbedMessage('Trade Details', tradeDetails)] });
}

module.exports = {
    getHoldings,
    showTrade
};
