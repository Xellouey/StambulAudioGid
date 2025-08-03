import { useState, useEffect } from 'react';
import { AudioPlayerState } from '../../../shared/types';

const useAudioPlayer = () => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  useEffect(() => {
    // TODO: Initialize react-native-track-player
    // TrackPlayer.setupPlayer();

    return () => {
      // Cleanup
      // TrackPlayer.destroy();
    };
  }, []);

  const playAudio = async (audioUrl: string) => {
    try {
      // TODO: Implement with react-native-track-player
      // await TrackPlayer.add({
      //   id: audioUrl,
      //   url: audioUrl,
      //   title: 'Audio Guide',
      //   artist: 'Dagestan Audio Guide',
      // });
      // await TrackPlayer.play();

      setPlayerState(prev => ({
        ...prev,
        isPlaying: true,
        currentTrack: audioUrl,
      }));

      console.log('Playing audio:', audioUrl);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseAudio = async () => {
    try {
      // TODO: Implement with react-native-track-player
      // await TrackPlayer.pause();

      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
      }));

      console.log('Audio paused');
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      // TODO: Implement with react-native-track-player
      // await TrackPlayer.stop();
      // await TrackPlayer.reset();

      setPlayerState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });

      console.log('Audio stopped');
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      // TODO: Implement with react-native-track-player
      // await TrackPlayer.seekTo(position);

      setPlayerState(prev => ({
        ...prev,
        currentTime: position,
      }));

      console.log('Seeking to:', position);
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  return {
    playerState,
    playAudio,
    pauseAudio,
    stopAudio,
    seekTo,
  };
};

export default useAudioPlayer;
