import { api } from '@/services/api';
import { API_ROUTES } from '@/config/api';

export function editTreasury(
  id: number,
  payload: {
    description: string;
    frontPage: number;
    thumbnail: number;
    tags?: number[];
    discordLink?: string;
    websiteLink?: string;
    twitterUser?: string;
    moreLinks?: any[];
  }
) {
  const path = `${API_ROUTES.PLURAL_TREASURY.path}/${id}`;

  return api.put(path, {
    data: {
      description: payload.description,
      frontPage: payload.frontPage,
      thumbnail: payload.thumbnail,
      tags: payload?.tags || [],
      discordLink: payload?.discordLink,
      websiteLink: payload?.websiteLink,
      twitterUser: payload?.twitterUser,
      moreLinks: payload?.moreLinks
    }
  });
}

export function addCollectionAddressTrack(
  id: number,
  payload: { acceptedCollectionAddress: string }
) {
  const path = `${API_ROUTES.SINGULAR_TREASURY.path}/${id}/acceptedCollectionAddress`;

  return api.post(path, {
    data: payload
  });
}

export function deleteCollectionAddressTrack(
  id: number,
  payload: { acceptedCollectionAddress: string }
) {
  const path = `${API_ROUTES.SINGULAR_TREASURY.path}/${id}/acceptedCollectionAddress/${payload.acceptedCollectionAddress}`;
  return api.delete(path);
}

export function getCollectionsInfoFromTreasury<T>(id: number) {
  const path = `${API_ROUTES.SINGULAR_TREASURY.path}/${id}/collections-info`;
  return api.get<T>(path);
}

export function addCanBeWriteFromTreasury<T>(
  id: number,
  payload: { address: string }
) {
  const path = `${API_ROUTES.SINGULAR_TREASURY.path}/${id}/addCanBeWriter`;
  return api.post<T>(path, {
    data: payload
  });
}

export async function addTreasuryAddressFromTreasury<T>(
  id: number,
  payload: { address: string; color: string; label: string }
) {
  const path1 = `${API_ROUTES.PLURAL_TREASURY_ADDRESS.path}`;
  const path2 = `${API_ROUTES.SINGULAR_TREASURY.path}/${id}/addTreasuryAddress`;

  const { data } = await api.post<T>(path1, {
    data: payload
  });

  return api.post<T>(path2, {
    data: {
      id: (data as any)?.data?.id
    }
  });
}

export function editTreasuryAddressFromTreasury<T>(
  id: number,
  payload: { color?: string; label?: string }
) {
  const path = `${API_ROUTES.PLURAL_TREASURY_ADDRESS.path}/${id}`;

  return api.put<T>(path, {
    data: payload
  });
}

export function deleteTreasuryAddressesFromTreasury(
  id: number,
  payload: { id: number }
) {
  const path = `${API_ROUTES.PLURAL_TREASURY.path}/${id}`;
  return api.put(path, {
    data: {
      treasuryAddresses: {
        disconnect: [payload.id]
      }
    }
  });
}

export function deleteCanBeWriteFromTreasury(
  id: number,
  payload: { id: number }
) {
  const path = `${API_ROUTES.PLURAL_TREASURY.path}/${id}`;
  return api.put(path, {
    data: {
      canBeWrite: {
        disconnect: [payload.id]
      }
    }
  });
}

export function getAllNftFromProject(id?: number) {
  if (!id) return null;
  return `${API_ROUTES.PLURAL_TREASURY.path}/${id}/nfts`;
}

export function getSPLTransferFromProject(id?: number) {
  if (!id) return null;
  return `${API_ROUTES.PLURAL_TREASURY.path}/${id}/spl-transactions`;
}

export function getMetadataForProject(id?: number) {
  if (!id) return null;
  return `${API_ROUTES.PLURAL_TREASURY.path}/${id}/metadata`;
}
