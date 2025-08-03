import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';

export const setupTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  } catch (error) {
    console.error('Error setting up TrackPlayer:', error);
  }
};

export const playAudio = async (
  url: string,
  title: string,
  artist?: string
) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: '1',
      url,
      title,
      artist: artist || 'Dagestan Audio Guide',
    });
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};

export const pauseAudio = async () => {
  try {
    await TrackPlayer.pause();
  } catch (error) {
    console.error('Error pausing audio:', error);
  }
};

export const stopAudio = async () => {
  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  } catch (error) {
    console.error('Error stopping audio:', error);
  }
};
