import { tokenSchemaValidation } from '../../Token/Models/Token.schema';

export const projectSchemaValidation = {
  $id: 'projectSchema',
  type: 'object',
  required: ['treasuryId', 'name'],
  properties: {
    treasuryId: { type: 'string' },
    name: { type: 'string' },
    image: { type: 'string' },
    tokens: {
      type: 'array',
      $ref: tokenSchemaValidation.$id,
    },
  },
};
