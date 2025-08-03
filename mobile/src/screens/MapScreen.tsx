import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

interface Props {
  navigation: MapScreenNavigationProp;
  route: MapScreenRouteProp;
}

const MapScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tour, startFromPOI } = route.params;
  const pointsOfInterest = tour.attributes.point_of_interests?.data || [];

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {tour.attributes.name}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderTitle}>🗺️ Карта маршрута</Text>
          <Text style={styles.placeholderSubtitle}>
            Здесь будет отображена Yandex карта
          </Text>
          <Text style={styles.placeholderInfo}>
            Тур: {tour.attributes.name}
          </Text>
          <Text style={styles.placeholderInfo}>
            Точек интереса: {pointsOfInterest.length}
          </Text>
          {startFromPOI && (
            <Text style={styles.placeholderInfo}>
              Начать с точки: {startFromPOI + 1}
            </Text>
          )}
        </View>
      </View>

      {/* POI List Preview */}
      <View style={styles.poiPreview}>
        <Text style={styles.poiPreviewTitle}>Точки маршрута:</Text>
        {pointsOfInterest.slice(0, 3).map((poi, index) => (
          <View key={poi.id} style={styles.poiPreviewItem}>
            <Text style={styles.poiPreviewIndex}>{index + 1}</Text>
            <Text style={styles.poiPreviewName} numberOfLines={1}>
              {poi.attributes.name}
            </Text>
            {poi.attributes.isFree && (
              <Text style={styles.freeLabel}>Бесплатно</Text>
            )}
          </View>
        ))}
        {pointsOfInterest.length > 3 && (
          <Text style={styles.morePointsText}>
            +{pointsOfInterest.length - 3} точек
          </Text>
        )}
      </View>

      {/* Development Info */}
      <View style={styles.devInfo}>
        <Text style={styles.devInfoText}>
          🚧 В разработке: интеграция с Yandex MapKit
        </Text>
        <Text style={styles.devInfoText}>
          Следующий этап: задача 3.4 - настройка карты
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 60, // Balance the back button
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  placeholderInfo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  poiPreview: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    maxHeight: 200,
  },
  poiPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  poiPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  poiPreviewIndex: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  poiPreviewName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  freeLabel: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  morePointsText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  devInfo: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffeaa7',
  },
  devInfoText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default MapScreen;
