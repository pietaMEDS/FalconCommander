export async function SelectTypeSend (interaction) {
  if ( true
    // interaction.member.roles.cache.some(
    //   (role) => role.name === "Офицерский состав"
    // )
  ) {
    let selecter = new StringSelectMenuBuilder()
      .setCustomId("rankUpClass")
      .setPlaceholder("Выберите тип")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Очередное")
          .setDescription("Очередное повышение по выполнению критериев")
          .setValue("query"),

        new StringSelectMenuOptionBuilder()
          .setLabel("Внеочередное")
          .setDescription("Внеочередное повышение данное командованием")
          .setValue("force")
      );

      let row = new ActionRowBuilder()
        .addComponents(selecter);

    await interaction.reply({
      content: "Выберите тип повышения",
      component: [row],
    });
  } else {
    await interaction.reply({
        content: "Вы не можете повышать участников",
        ephemeral: true,
    })
  }
};

export async function QueryFormCheck(interaction) {
        let users = JSON.parse(await readFile("./data/users.json"));
        let soldiers = interaction.fields.fields
          .get("soldiers")
          .value.split(",");
        let activies = await MemberSort(
          interaction,
          soldiers,
          users,
          interaction.member.nickname
        );


        interaction.options._hoistedOptions.forEach((element) => {
          if (element.name == "type") {
            type = element;
          }
        });

    if (type.value.split(":")[1] == "query") {
        
    }
}