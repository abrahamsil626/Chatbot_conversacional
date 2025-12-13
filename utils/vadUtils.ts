// Calculate Root Mean Square (RMS) volume from audio buffer
export const calculateRMS = (dataArray: Uint8Array): number => {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  const rms = Math.sqrt(sum / dataArray.length);
  return rms;
};

// Convert Blob to File object for FormData
export const blobToFile = (theBlob: Blob, fileName: string): File => {
  return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
};
