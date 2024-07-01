// dataManager.js
const fs = require('fs');
const path = require('path');

const playersFilePath = path.join(__dirname, 'players.json');
const tradesFilePath = path.join(__dirname, 'trades.json');

function readJSON(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getPlayers() {
    return readJSON(playersFilePath) || {};
}

function savePlayers(players) {
    writeJSON(playersFilePath, players);
}

function getTrades() {
    return readJSON(tradesFilePath) || [];
}

function saveTrades(trades) {
    writeJSON(tradesFilePath, trades);
}

module.exports = {
    getPlayers,
    savePlayers,
    getTrades,
    saveTrades
};
