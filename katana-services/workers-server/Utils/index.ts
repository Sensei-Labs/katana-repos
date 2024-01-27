// eslint-disable-next-line max-len
export async function asyncMap<T = any, K = T>(array: T[], callback: (item: T, index: number) => K | Promise<K>) {
  const output = [];

  for (const index in array) {
    const item = array[index];
    output.push(await callback(item, Number(index)));
  }

  return output;
}
