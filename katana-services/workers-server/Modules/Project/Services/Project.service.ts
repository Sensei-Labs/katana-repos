import { IToken, ITokenModel } from '../../Token/Models/Token.model';
import { TokenService } from '../../Token/Services/Token.service';
import ProjectModel, { IProject } from '../Models/Project.model';
import { asyncMap } from '../../../Utils';
import { getSplTokens } from '../../../Services/web3/getSplTokens';
import { ProjectType } from '../../../Workers/Repositories/Project.respository';
import { ModelInterface } from '../../../Interfaces/Model.interface';
import { fetchCollectionInfo } from '../../../Services/web3/collections';

const tokenService = new TokenService();

export class ProjectService extends ModelInterface<IProject> {
  constructor() {
    super(ProjectModel);
  }

  async findOne(query: Partial<IProject>) {
    return ProjectModel.findOne(query).populate(['tokens', 'collections']);
  }

  getTokensInProject(tokens: IToken[]) {
    const groupTokens: IToken[] = [];

    tokens.forEach((token) => {
      const find = groupTokens.find((groupToken) => {
        return groupToken.mintAddress === token.mintAddress;
      });

      if (find) {
        find.amount += token.amount;
      } else {
        groupTokens.push(token);
      }
    });

    return groupTokens;
  }

  async resolveTokensInProject(
    walletAddress: string,
    tokensInDB: ITokenModel[],
    splTokensFromProject: IToken[],
  ) {
    const news: IToken[] = [];
    const updates: ITokenModel[] = [];
    const deletes: ITokenModel[] = [];

    await asyncMap(splTokensFromProject, async (splToken) => {
      try {
        const find = await tokenService.findOne({
          mintAddress: splToken.mintAddress,
          owner: walletAddress,
        });

        if (find) {
          find.owner = walletAddress;
          find.price = splToken.price;
          find.priceUsd = splToken.priceUsd;
          find.priceSol = splToken.priceSol;
          find.amount = splToken.amount;
          find.model = splToken.model;
          updates.push(find);
        } else {
          splToken.owner = walletAddress;
          news.push(splToken);
        }
      } catch (e) {
        console.log(`Error al buscar el Token en DB minAddress: ${splToken.mintAddress}`, e);
      }
    });

    tokensInDB.forEach((token) => {
      if (token.owner === walletAddress) {
        const findInDB = splTokensFromProject.find((splToken) => {
          return splToken.mintAddress === token.mintAddress;
        });
        if (!findInDB) {
          deletes.push(token);
        }
      }
    });

    return {
      news,
      updates,
      deletes,
    };
  }

  async createOrUpdateOrDeleteTokensInProject(
    projectId: string,
    news: IToken[],
    updates: ITokenModel[],
    deletes: ITokenModel[],
  ) {
    const project = await this.findById(projectId);
    let tokens = project?.tokens || [];

    deletes.forEach((token) => {
      tokens = tokens.filter((tokenDB) => tokenDB.mintAddress !== token.mintAddress);
    });

    await asyncMap(updates, async (token) => {
      try {
        await token.save();
      } catch (e) {
        console.log(`El token no se pudo actualizar mintAddress: ${token.mintAddress}`, e);
      }
    });

    await asyncMap(news, async (token) => {
      try {
        const newToken = await tokenService.create(token);
        tokens.push(newToken);
      } catch (e) {
        console.log(`El token no se pudo crear mintAddress: ${token.mintAddress}`, e);
      }
    });

    if (news.length || updates.length || deletes.length) {
      try {
        await this.updateById(projectId, {
          tokens,
        });
      } catch (e) {
        console.log(`El project no pudo actualizar los tokens projectId: ${projectId}`, e);
      }
    }
  }

  async updateSPLTokensInProject(project: ProjectType) {
    console.log(`** Update SPL tokens for project: ${project.treasuryId} **`);

    // iteration for treasury addresses
    await asyncMap(project.treasuryAddresses, async (account) => {
      console.log(`-- Fetching data for address: ${account.address} --`);
      const splTokensFromProject = await getSplTokens(account.address);
      const { news, updates, deletes } = await this.resolveTokensInProject(
        account.address,
        project.tokens as any,
        splTokensFromProject,
      );
      console.log(`-- New SPL Tokens: ${news.length} --`);
      console.log(`-- Update SPL Tokens: ${updates.length} --`);
      console.log(`-- Remove SPL Tokens: ${deletes.length} --`);

      await this.createOrUpdateOrDeleteTokensInProject(project._id, news, updates, deletes);
      console.log('-- Tokens Updated finish --');
    });
  }

  async updateCollectionsInProject(project: ProjectType) {
    console.log(`** Update Collection info for project: ${project.treasuryId} **`);

    if (!project?.collections) return null;

    const collectionInfo = await asyncMap(project.collections, async (collection) => {
      console.log(`-- Fetching data for collection: ${collection.collectionOnchainId} --`);
      const { data: internalCollectionInfo } = await fetchCollectionInfo(
        collection.solscanID,
        collection.magicEdenSymbol,
      );
      return internalCollectionInfo;
    });

    if (collectionInfo) {
      console.log('-- Updated Collection Info --');
      await this.updateOne(project._id, { collectionInfo });
    }
    console.log('-- Collection Updated finish --');
    return true;
  }
}
