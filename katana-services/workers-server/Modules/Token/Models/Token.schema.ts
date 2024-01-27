export const collectionSchemaValidation = {
  $id: 'collectionSchema',
  type: 'object',
  properties: {
    collectionAddress: { type: 'string' },
    name: { type: 'string' },
  },
};

export const tokenSchemaValidation = {
  $id: 'tokenSchema',
  type: 'object',
  properties: {
    mintAddress: { type: 'string' },
    name: { type: 'string' },
    icon: { type: 'string' },
    symbol: { type: 'string' },
    image: { type: 'string' },
    price: { type: 'number' },
    collectionId: { type: 'string' },
    collectionInfo: {
      $ref: collectionSchemaValidation.$id,
    },
  },
  required: ['mintAddress'],
};
