import { v4 } from 'uuid';
import Identicon from 'identicon.js';

function base64ToFile(base64String: string, filename: string) {
  const byteString = atob(base64String);

  // Convierte la cadena decodificada en un ArrayBuffer
  const bufferLength = byteString.length;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < bufferLength; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uintArray], { type: 'image/png' });
  return new File([blob], filename, {
    type: 'image/png',
    lastModified: Date.now()
  });
}

export const createAvatar = (wallet: string) => {
  const textUuid = v4();
  const base64Data = new Identicon(textUuid, 64).toString();
  return base64ToFile(base64Data, `${wallet}.png`);
};
