import mongoose from 'mongoose';

const { Schema } = mongoose;

type StatisticData = number[];
type StatisticLabels = string[];
type StatisticColors = string[];

export interface IStatisticPie {
  colors: StatisticColors;
  labels: StatisticLabels;
  values: StatisticData;
}

export interface IStatisticLine {
  colors: StatisticColors;
  labels: StatisticLabels;
  tags: StatisticLabels;
  data: {
    name: string;
    values: StatisticData;
  }[];
}

export const schemaStatisticPie = new Schema<IStatisticPie>({
  colors: {
    type: [String],
    default: [],
  },
  labels: {
    type: [String],
    default: [],
  },
  values: {
    type: [Number],
    default: [],
  },
});

const schemaStatisticLineData = new Schema({
  name: {
    type: String,
    default: '',
  },
  values: {
    type: [Number],
    default: [],
  },
});

export const schemaStatisticLine = new Schema<IStatisticLine>({
  colors: {
    type: [String],
    default: [],
  },
  labels: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  data: {
    type: [schemaStatisticLineData],
    default: [],
  },
});
