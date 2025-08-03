import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { POI } from '../../../shared/types';

interface POIPopupProps {
  poi: POI;
  onPlayAudio: () => void;
  onClose: () => void;
  isPlaying?: boolean;
}

const POIPopup: React.FC<POIPopupProps> = ({
  poi,
  onPlayAudio,
  onClose,
  isPlaying = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{poi.attributes.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{poi.attributes.description}</Text>

      {poi.attributes.audio?.data && (
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={onPlayAudio}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸️ Пауза' : '▶️ Воспроизвести'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    lineHeight: 20,
  },
  playButton: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: '#ff9800',
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default POIPopup;
