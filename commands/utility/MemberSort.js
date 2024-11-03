export default async (interaction, soldiers, users, orginizer) => {
    let activies = ""

    let orginizerId = orginizer.split("|")[0].trim().split(" ")[2]
    let orginizerPriority = 0
    let maxPriority = 0;

    users.users.forEach((member, userkey) =>{
        if(member.id == orginizerId){
            orginizerPriority = member.rank.priority
        } 
    })

    for (let priorityIndex = 20; priorityIndex >= 0; priorityIndex--) {
        soldiers.forEach( (unit, key) => {
            unit = unit.replace(/\s+/g, '');
        
                users.users.forEach((member, userkey) =>{
                    if (member.name.toLowerCase() == unit.toLowerCase() && member.rank.priority == priorityIndex) {
                        if (member.rank.priority > maxPriority) {
                            maxPriority = member.rank.priority
                        }
                        activies+="- "+member.guild+" "+member.rank.name+" "+member.id+" "+member.name+`
`
                    }
                })
        });
    }

    if (maxPriority > orginizerPriority) {
        return false;
    }

    return activies;
}