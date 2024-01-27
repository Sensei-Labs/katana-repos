export const statisticPieSchemaValidation = {
  $id: 'statisticPieSchemaValidation',
  type: 'object',
  required: [
    'transactionType',
    'statisticDataDaily',
    'statisticDataWeekly',
    'statisticDataMonthly',
    'statisticDataYearly',
    'statisticDataAll',
  ],
  properties: {
    transactionType: {
      type: 'string',
    },
    statisticDataDaily: {
      type: 'object',
      required: ['colors', 'labels', 'values'],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        values: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
    statisticDataWeekly: {
      type: 'object',
      required: [
        'colors',
        'labels',
        'values',
      ],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        values: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
    statisticDataMonthly: {
      type: 'object',
      required: [
        'colors',
        'labels',
        'values',
      ],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        values: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
    statisticDataYearly: {
      type: 'object',
      required: [
        'colors',
        'labels',
        'values',
      ],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        values: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
    statisticDataAll: {
      type: 'object',
      required: [
        'colors',
        'labels',
        'values',
      ],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        values: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
  },
};

export const statisticLineSchemaValidation = {
  $id: 'statisticLineSchema',
  type: 'object',
  required: [
    'transactionType',
    'statisticDataDaily',
    'statisticDataMonthly',
    'statisticDataWeekly',
    'statisticDataYearly',
  ],
  properties: {
    transactionType: {
      type: 'string',
    },
    statisticDataDaily: {
      type: 'object',
      required: ['data'],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'values'],
            properties: {
              name: {
                type: 'string',
              },
              values: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        },
      },
    },
    statisticDataMonthly: {
      type: 'object',
      required: ['data'],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'values'],
            properties: {
              name: {
                type: 'string',
              },
              values: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        },
      },
    },
    statisticDataWeekly: {
      type: 'object',
      required: ['data'],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'values'],
            properties: {
              name: {
                type: 'string',
              },
              values: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        },
      },
    },
    statisticDataYearly: {
      type: 'object',
      required: ['data'],
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'values'],
            properties: {
              name: {
                type: 'string',
              },
              values: {
                type: 'array',
                items: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
};
