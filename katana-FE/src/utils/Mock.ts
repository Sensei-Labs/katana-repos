import { randomUniform } from 'd3-random';

const _min = 0;
const _max = 40;

type OutputType = {
  getRandomArray(count: number, min?: number, max?: number): number[];
};

function Mock(): OutputType {
  return {
    getRandomArray(count: number, min = _min, max = _max) {
      const output: number[] = [];

      for (let index = 0; index < count; index++) {
        const random: number = randomUniform(min, max)();
        output.push(random);
      }

      return output;
    }
  };
}

export default Mock();
