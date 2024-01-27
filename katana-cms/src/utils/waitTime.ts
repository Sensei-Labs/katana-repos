export function waitTime(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

const SOLSCAN_SECONDS_LIMIT = 30; // 30 seconds
const SOLSCAN_MAX_REQUEST = 130; // 140 request in 30 seconds

export function waitDynamicTime(length: number, maxItems: number = SOLSCAN_MAX_REQUEST, maxTime: number = SOLSCAN_SECONDS_LIMIT) {
  return new Promise((resolve) => {
    const calcTime = () => {
      if (length < maxItems) return 0;
      return maxTime / maxItems;
    }
    setTimeout(resolve, calcTime() * 1000);
  });
}

// 260 / 30 = 1
