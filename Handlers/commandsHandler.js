const { readdirSync } = require("fs");
const ascii = require("ascii-table");

let table = new ascii("Comandos");
table.setHeading("Comando", "Estado");

module.exports = (client) => {
    const commandFolders = readdirSync("./Commands");
    for(const folder of commandFolders) {
        const commandFiles = readdirSync(`./Commands/${folder}`).filter(files => files.endsWith(".js"));
        const commandsArry = []
        for(const file of commandFiles) {
            const command = require(`../Commands/${folder}/${file}`);
            client.commands.set(command.name, command);
            table.addRow(file, "✅ Cargado.")
        }  
    }
    console.log(table.toString());
}