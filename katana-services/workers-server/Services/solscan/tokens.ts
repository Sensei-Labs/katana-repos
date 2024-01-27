import solscanInstance from '../../Config/Fetch/solscanInstance';

type SolscanTokenAccount = {
  symbol: string;
  address: string;
  name: string;
  icon: string;
  decimals?: number;
  price?: number; // in SOL
  volume: number;
  tokenAuthority: any;
  supply: string;
  type: string;
};

export async function getTokenInfo(
  tokenAddress: string,
): Promise<{ data: SolscanTokenAccount | null; errors: any }> {
  try {
    const { data } = await solscanInstance.get<SolscanTokenAccount>(
      `token/meta/?tokenAddress=${tokenAddress}`,
    );

    return {
      data,
      errors: null,
    };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      errors: e,
    };
  }
}
