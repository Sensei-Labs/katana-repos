import mongoose from 'mongoose';
import { IToken, modelName as modelNameToken } from '../../Token/Models/Token.model';
import {
  ICollection,
  ICollectionInfo,
  collectionSchema,
  schemaCollectionInfo,
} from '../../Collection/Models/Collection.model';
import { CMSProjectsInterface } from '../../../Workers/Interfaces';
import {
  IStatisticPie,
  IStatisticLine,
  schemaStatisticPie,
  schemaStatisticLine,
} from '../../Statistic/Models/Statistic.model';

const { Schema } = mongoose;

export interface IProject {
  treasuryId: string;
  name: string;
  image?: string;
  tokens: IToken[];
  collections: ICollection[];
  collectionInfo: ICollectionInfo[];
  treasuryAddresses: CMSProjectsInterface['treasuryAddresses'];
  totalInputUsd: number;
  totalOutputUsd: number;
  totalInputSol: number;
  totalOutputSol: number;

  // pie input
  inStatisticPieDaily?: IStatisticPie;
  inStatisticPieWeekly?: IStatisticPie;
  inStatisticPieMonthly?: IStatisticPie;
  inStatisticPieYearly?: IStatisticPie;
  inStatisticPieAll?: IStatisticPie;
  // pie output
  outStatisticPieDaily?: IStatisticPie;
  outStatisticPieWeekly?: IStatisticPie;
  outStatisticPieMonthly?: IStatisticPie;
  outStatisticPieYearly?: IStatisticPie;
  outStatisticPieAll?: IStatisticPie;

  // line input
  inStatisticLineDaily?: IStatisticLine;
  inStatisticLineWeekly?: IStatisticLine;
  inStatisticLineMonthly?: IStatisticLine;
  inStatisticLineYearly?: IStatisticLine;

  // line output
  outStatisticLineDaily?: IStatisticLine;
  outStatisticLineWeekly?: IStatisticLine;
  outStatisticLineMonthly?: IStatisticLine;
  outStatisticLineYearly?: IStatisticLine;
}

export type IProjectModel = mongoose.Document & IProject;

const projectSchema = new Schema<IProjectModel>({
  treasuryId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  tokens: [
    {
      type: Schema.Types.ObjectId,
      ref: modelNameToken,
    },
  ],
  totalInputUsd: {
    type: Number,
    default: 0,
  },
  totalOutputUsd: {
    type: Number,
    default: 0,
  },
  totalInputSol: {
    type: Number,
    default: 0,
  },
  totalOutputSol: {
    type: Number,
    default: 0,
  },
  collections: [
    {
      type: collectionSchema,
    },
  ],
  collectionInfo: {
    type: [schemaCollectionInfo],
  },
  treasuryAddresses: [
    {
      type: new Schema({
        label: String,
        address: String,
      }),
      default: [],
    },
  ],
  // pie data chart
  inStatisticPieDaily: schemaStatisticPie,
  inStatisticPieWeekly: schemaStatisticPie,
  inStatisticPieMonthly: schemaStatisticPie,
  inStatisticPieYearly: schemaStatisticPie,
  inStatisticPieAll: schemaStatisticPie,
  outStatisticPieDaily: schemaStatisticPie,
  outStatisticPieWeekly: schemaStatisticPie,
  outStatisticPieMonthly: schemaStatisticPie,
  outStatisticPieYearly: schemaStatisticPie,
  outStatisticPieAll: schemaStatisticPie,

  // line data chart
  inStatisticLineDaily: schemaStatisticLine,
  inStatisticLineWeekly: schemaStatisticLine,
  inStatisticLineMonthly: schemaStatisticLine,
  inStatisticLineYearly: schemaStatisticLine,
  outStatisticLineDaily: schemaStatisticLine,
  outStatisticLineWeekly: schemaStatisticLine,
  outStatisticLineMonthly: schemaStatisticLine,
  outStatisticLineYearly: schemaStatisticLine,
});

export const modelName = 'project';

const ProjectModel = mongoose.model<IProjectModel>(modelName, projectSchema);

export default ProjectModel;
