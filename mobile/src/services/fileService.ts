import RNFS from 'react-native-fs';

export const fileService = {
  // Download and cache audio files
  async downloadAudioFile(url: string, fileName: string): Promise<string> {
    try {
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Check if file already exists
      const fileExists = await RNFS.exists(downloadDest);
      if (fileExists) {
        return downloadDest;
      }

      // Download the file
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
      }).promise;

      if (downloadResult.statusCode === 200) {
        return downloadDest;
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.statusCode}`
        );
      }
    } catch (error) {
      console.error('Error downloading audio file:', error);
      throw error;
    }
  },

  // Get cached file path
  async getCachedFilePath(fileName: string): Promise<string | null> {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const fileExists = await RNFS.exists(filePath);
      return fileExists ? filePath : null;
    } catch (error) {
      console.error('Error checking cached file:', error);
      return null;
    }
  },

  // Clear cache
  async clearCache(): Promise<void> {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const audioFiles = files.filter(
        file =>
          file.name.endsWith('.mp3') ||
          file.name.endsWith('.wav') ||
          file.name.endsWith('.m4a')
      );

      for (const file of audioFiles) {
        await RNFS.unlink(file.path);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  // Get cache size
  async getCacheSize(): Promise<number> {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const audioFiles = files.filter(
        file =>
          file.name.endsWith('.mp3') ||
          file.name.endsWith('.wav') ||
          file.name.endsWith('.m4a')
      );

      let totalSize = 0;
      for (const file of audioFiles) {
        const stat = await RNFS.stat(file.path);
        totalSize += stat.size;
      }

      return totalSize;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  },
};
