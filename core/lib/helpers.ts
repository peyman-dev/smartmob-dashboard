export const locateImagePath = (fileName: string) =>
  `/assets/static/images/${fileName}`;

export const localeDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString("fa-IR");
