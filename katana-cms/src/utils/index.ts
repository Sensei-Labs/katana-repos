import { fetchInstance } from '../services/fetch';

function map(array, callback) {
  const output = [];

  for (let index in array) {
    const item = array[index];
    output.push(callback(item, index));
  }

  return output;
}

async function asyncMap(array, callback) {
  const output = [];

  for (let index in array) {
    const item = array[index];
    output.push(await callback(item, index));
  }

  return output;
}

export const clearArray = <T = unknown>(arr: T[]) => {
  if (!Array.isArray(arr)) return [];
  return arr;
};

function addNewRecordToArray(keyMap, array = []) {
  const arr = [...clearArray(array)];
  if (!arr?.length) arr.push(keyMap);
  else {
    const findExistentAddress = arr.find((address) => address === keyMap);
    if (findExistentAddress) return null;

    arr.push(keyMap);
  }

  return arr;
}

const Utils = {
  map,
  fetchInstance,
  addNewRecordToArray,
  asyncMap
};

export const ROYALTY_COLOR = '#ff9800';

export default Utils;
