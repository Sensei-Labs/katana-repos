import dayjs from 'dayjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenService } from '../Services/Token.service';
import { getTokenMetaInfoWithPrice } from '../../../Services/web3/getSplTokens';
import metaplex from '../../../Services/web3/metaplex';
import { PublicKey } from '../../../Utils/web3';
import { APP_INTERVAL_EXEC } from '../../../Config/env';

const tokenService = new TokenService();

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const tokens = await tokenService.findAll({});
  reply.code(200).send(tokens);
}

export async function findOrCreateByAddress(
  request: FastifyRequest<{
    Params: { mintAddress: string };
  }>,
  reply: FastifyReply,
) {
  const { mintAddress } = request.params;
  const token = await tokenService.findOne({ mintAddress });
  if (!token) {
    const { model } = await metaplex.nfts().findByMint({
      mintAddress: PublicKey(mintAddress),
    });
    const getTokenMetadata = await getTokenMetaInfoWithPrice({
      mintAddress,
      model,
    });
    const newToken = await tokenService.create(getTokenMetadata);
    return reply.code(200).send(newToken);
  }
  if (token.model === 'nft') {
    // TODO: verify token price after 15min
    if (!token?.updatedAt || dayjs().diff(dayjs(token?.updatedAt), 'minute') > APP_INTERVAL_EXEC) {
      const getTokenMetadata = await getTokenMetaInfoWithPrice({
        mintAddress,
        model: token.model,
      });

      const tokenUpdated = await tokenService.updateById(token.id, {
        price: getTokenMetadata.price,
        priceSol: getTokenMetadata.priceSol,
      });

      return reply.code(200).send(tokenUpdated);
    }
  }
  return reply.code(200).send(token);
}
