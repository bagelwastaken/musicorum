const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");

module.exports = {
    name: 'queue',
	description: 'Shows the queue of songs',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
    
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page number of the queue").setMinValue(1)),

    execute: async ({ client, interaction }) => {
        const player = useMasterPlayer()
        const queue = await player.nodes.create(interaction.guild)
        if (!queue || !queue.playing){
            return await interaction.followUp("There are no songs in the queue")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page + 1 > totalPages) 
            return await interaction.followUp(`Invalid Page. There are only a total of ${totalPages} pages of songs`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
                    .setColor('#830691')
            ]
        })
    }
}