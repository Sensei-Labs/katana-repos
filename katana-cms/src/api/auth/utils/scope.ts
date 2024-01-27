import { getAllTreasuriesEmail } from './getAllTreasuriesEmail';
import { getTreasuriesFromCreatorEmail } from './getTreasuriesFromCreatorEmail';
import { mergeScope, ScopeType } from './mergeScope';
import NewDiscordAuth from '../services/newDiscordAuth';
import { getGuildInfoForTreasury, sanitizeProject } from '../../../utils/format';

export function getTreasuryCanBeWriteEmail(allTreasuries, rolesIds: string[]): ScopeType[] {
  const output = [];

  allTreasuries.forEach((treasury) => {
    const isAdmin = (treasury?.adminDiscordRolesID || []).some((roleID: string) => rolesIds.includes(roleID));

    if (isAdmin) {
      output.push({
        ...sanitizeProject(treasury),
        isCreator: false,
        canBeWrite: isAdmin,
        canBeRead: isAdmin
      });
    }
  });

  return output;
}

export function getTreasuriesCanBeReadEmail(allTreasuriesDB, rolesIds: string[], hasSenseiToken: boolean): ScopeType[] {
  return allTreasuriesDB.map((treasury) => {
    const isRead = (treasury?.accessDiscordRolesID || []).some((roleID: string) => rolesIds.includes(roleID));

    return {
      ...sanitizeProject(treasury),
      isCreator: false,
      canBeWrite: false,
      canBeRead: isRead || hasSenseiToken
    };
  });
}

export const getNewScope = async (email: string, discordService: NewDiscordAuth, hasSenseiToken: boolean) => {
  const allTreasuriesDB = await getAllTreasuriesEmail(strapi);

  // all discords guilds by User
  const guildsInDiscordRaw = await discordService.getDiscordGuilds();
  const guildsInDiscordMatchWithDB = getGuildInfoForTreasury(guildsInDiscordRaw, allTreasuriesDB);

  // all discords roles by guilds
  const rolesGuildsInDiscord = await discordService.getDiscordRolesForGuildsInDB(guildsInDiscordMatchWithDB);

  const treasuryCreators = getTreasuriesFromCreatorEmail(allTreasuriesDB, email);
  const treasuryCanBeWrite = getTreasuryCanBeWriteEmail(allTreasuriesDB, rolesGuildsInDiscord);
  const treasuryCanBeRead = getTreasuriesCanBeReadEmail(allTreasuriesDB, rolesGuildsInDiscord, hasSenseiToken);

  console.log({
    guildsInDiscordMatchWithDB,
    rolesGuildsInDiscord,
    treasuryCreators,
    treasuryCanBeWrite,
    treasuryCanBeRead
  });

  const scope = mergeScope({ treasuryCreators, treasuryCanBeWrite, treasuryCanBeRead });

  return {
    scope
  };
};
