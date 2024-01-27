import { CMSProjectsInterface, FetchInterface } from '../Interfaces';
import cmsInstance from '../../Config/Fetch/cmsInstance';
import { ICollection } from '../../Modules/Collection/Models/Collection.model';

type InternalCollectionInterface = Omit<CMSProjectsInterface, 'collection_nfts_addresses'> & {
  collection_nfts_addresses: (Omit<ICollection, 'name' | 'cmsID'> & {
    id: number;
    Name: string;
  })[];
};

class ProjectFetchRepository implements FetchInterface<CMSProjectsInterface[]> {
  public async get() {
    try {
      const res = await cmsInstance.get<{ data: InternalCollectionInterface[] }>('/treasuries', {
        params: {
          populate: ['thumbnail', 'treasuryAddresses', 'collection_nfts_addresses'],
          pagination: {
            pageSize: 1000,
          },
        },
      });
      return (
        res?.data?.data?.map((item) => {
          return {
            ...item,
            collection_nfts_addresses: item.collection_nfts_addresses.map((collection) => ({
              cmsID: collection.id,
              name: collection.Name,
              address: collection.address,
              solscanID: collection.solscanID,
              collectionOnchainId: collection.collectionOnchainId,
              magicEdenSymbol: collection.magicEdenSymbol,
            })),
          };
        }) || []
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

export default ProjectFetchRepository;
