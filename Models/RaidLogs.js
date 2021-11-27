const { Schema, model }	= require("mongoose");

const raidLogsSchema = new Schema({
    guildId: {
    	type: String
    },
    channelId: {
        type: String
    },
    actived: {
        type: Boolean
    }
});

module.exports = model('RaidLogs', raidLogsSchema);