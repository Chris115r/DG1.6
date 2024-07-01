// logger.js
const fs = require('fs');
const path = require('path');

function logError(error) {
    const errorLogPath = path.join(__dirname, 'error_log.json');
    const errors = fs.existsSync(errorLogPath) ? JSON.parse(fs.readFileSync(errorLogPath, 'utf8')) : [];
    errors.push({ error, timestamp: new Date().toISOString() });
    fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
}

function logBalanceEdit(user, amount) {
    const logChannel = user.guild.channels.cache.find(channel => channel.name === 'profit-allocation');
    if (logChannel) {
        logChannel.send(`${user.username}'s balance was adjusted by ${amount}.`);
    }
}

function logInfo(message) {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
}

module.exports = {
    logError,
    logBalanceEdit,
    logInfo
};
