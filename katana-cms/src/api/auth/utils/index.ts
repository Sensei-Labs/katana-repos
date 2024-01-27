import { Strapi } from '@strapi/strapi';
import Utils from '../../../utils';
import { SENSEI_CREATOR_MACHINE_ADDRESS } from '../../../config';
import { ScopeType } from './mergeScope';

const getTreasuryAddressesInArrayString = (treasury) => {
  return treasury?.collection_nfts_addresses?.map(({ collectionOnchainId }) => collectionOnchainId) || [];
};

export type UserPayload = {
  role: number;
  blocked: boolean;
  confirmed: boolean;
  provider: 'email';
  email: string;
  username: string;
  password: string;
  walletAddress?: string;
};

const createUser = async (userPayload: UserPayload) => {
  try {
    const { data } = await Utils.fetchInstance.post('/api/auth/local/register', userPayload);
    return {
      data,
      message: null,
      error: false
    };
  } catch (e) {
    return {
      data: null,
      message: e?.message || e,
      error: true
    };
  }
};

type UserType = {
  id: number;
  username: string;
  email: string;
  password: string;
  treasuries: {
    id: number;
    name: string;
    description: string;
  }[];
};

export async function getOrCreateClient(strapi: Strapi, walletAddress: string) {
  let code = 200;
  let message = 'Success access';

  const getDataExistsUser = await strapi.db.query('plugin::users-permissions.user').findOne({
    select: ['id', 'walletAddress'],
    where: { walletAddress },
    populate: {
      // @ts-ignore
      treasuries: true
    }
  });

  if (!getDataExistsUser) {
    try {
      const createNewUserData = await createUser({
        role: 1,
        blocked: false,
        confirmed: true,
        provider: 'email',
        email: `${walletAddress}@mail.com`,
        username: walletAddress,
        password: walletAddress,
        walletAddress
      });

      message = !createNewUserData ? 'Error record not found' : 'Success new record';
      code = !createNewUserData ? 500 : 201;

      return {
        code,
        message,
        isNew: true,
        user: createNewUserData?.data?.user as UserType,
        errors: !createNewUserData
      };
    } catch (e) {
      code = 500;
      message = 'Error user is not created';
      return {
        code,
        message,
        user: null,
        errors: false,
        isNew: true
      };
    }
  }

  return {
    code,
    message,
    isNew: false,
    errors: false,
    user: getDataExistsUser as UserType
  };
}

export function getTreasuriesFromCreator(treasuries, walletAddress: string) {
  return treasuries
    .filter(({ creator }) => creator?.walletAddress === walletAddress)
    .map((project) => ({
      ...project,
      isCreator: true,
      canBeWrite: true,
      canBeRead: true
    }));
}

export async function getAllTreasuries(strapi: Strapi) {
  const data =
    (await strapi.db.query('api::treasury.treasury').findMany({
      populate: {
        acceptedCollectionAddress: true,
        canBeWrite: true,
        collection_nfts_addresses: true,
        frontPage: true,
        thumbnail: true,
        creator: true,
        treasuryAddresses: true
      } as any
    })) || [];

  return data.map((item) => {
    return {
      ...item,
      canBeWrite:
        item?.canBeWrite?.map((admin) => ({
          id: admin.id,
          walletAddress: admin.walletAddress
        })) || [],
      creator: item?.creator
        ? {
            id: item.creator.id,
            walletAddress: item.creator.walletAddress
          }
        : null
    };
  });
}

// TODO: this action to DB request
export function getTreasuryCanBeWrite(allTreasuries, walletAddress: string) {
  const output = [];

  allTreasuries.map((treasury) => {
    const adminIds = treasury?.canBeWrite?.map((item) => item.walletAddress) || [];
    const isAdmin = adminIds.includes(walletAddress);

    if (isAdmin) {
      output.push({
        ...treasury,
        isCreator: false,
        canBeWrite: isAdmin,
        canBeRead: isAdmin
      });
    }
  });

  return output;
}

function verifyAddress(list, addresses: string | string[]) {
  const findToken = list.find(({ creators }) => {
    return creators?.find((creator) => {
      if (Array.isArray(addresses)) {
        return addresses.includes(creator?.address) && creator.verified === true;
      }
      return creator?.address === addresses && creator.verified === true;
    });
  });

  return Boolean(findToken);
}

function verifyAddressCollection(tokens, addresses) {
  const findToken = tokens.find(({ collection }) => {
    return collection.verified && addresses.includes(collection.address);
  });

  return Boolean(findToken);
}

export function verifySenseiToken(tokenList = []) {
  return verifyAddress(tokenList, SENSEI_CREATOR_MACHINE_ADDRESS);
}

export function getTreasuriesCanBeRead(allTreasuriesDB, tokens, hasSenseiToken) {
  if (hasSenseiToken)
    return allTreasuriesDB.map((treasury) => ({
      ...treasury,
      isCreator: false,
      canBeWrite: false,
      canBeRead: true
    }));
  return allTreasuriesDB
    .filter((treasury) => {
      const collectionAddresses = getTreasuryAddressesInArrayString(treasury);

      return verifyAddressCollection(tokens, collectionAddresses);
    })
    .filter((f) => !!f)
    .map((treasury) => {
      return {
        ...treasury,
        isCreator: false,
        canBeWrite: false,
        canBeRead: true
      };
    });
}

export async function updateTreasuriesInUser({ user, scope, strapi }: { user: any; scope: ScopeType[]; strapi: Strapi }) {
  const actuallyTreasury = user?.treasuries?.map((item) => item.id) || [];
  const removeTreasuries = [];
  const newTreasuries = [];

  scope.forEach((treasury) => {
    if (treasury.canBeRead) {
      if (!actuallyTreasury.includes(treasury.id)) {
        newTreasuries.push(treasury.id);
      }
    } else {
      if (actuallyTreasury.includes(treasury.id)) {
        removeTreasuries.push(treasury.id);
      }
    }
  });
  console.log('newTreasuries', { newTreasuries, removeTreasuries });
  if (newTreasuries.length || removeTreasuries.length) {
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        treasuries: {
          disconnect: removeTreasuries,
          connect: newTreasuries
        }
      }
    });
  }

  return { message: 'Ok', recall: !!newTreasuries.length || !!removeTreasuries.length };
}
