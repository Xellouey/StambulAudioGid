import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useTourDetails } from '../hooks';
import { LoadingSpinner } from '../components';
import {
  formatDuration,
  formatDistance,
  formatPrice,
  getImageUrl,
} from '../utils';

const { width: screenWidth } = Dimensions.get('window');

type TourDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TourDetail'
>;
type TourDetailScreenRouteProp = RouteProp<RootStackParamList, 'TourDetail'>;

interface Props {
  navigation: TourDetailScreenNavigationProp;
  route: TourDetailScreenRouteProp;
}

const TourDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tourId } = route.params;
  const { tour, isLoading, error, refreshTour } = useTourDetails(tourId);

  const handleStartTour = () => {
    if (tour) {
      navigation.navigate('Map', { tour });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Загрузка деталей тура..." />;
  }

  if (error || !tour) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>😔 {error || 'Тур не найден'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshTour}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = tour.attributes.main_image?.data?.attributes?.url;
  const fullImageUrl = getImageUrl(imageUrl);
  const pointsOfInterest = tour.attributes.point_of_interests?.data || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      {fullImageUrl ? (
        <Image source={{ uri: fullImageUrl }} style={styles.heroImage} />
      ) : (
        <View style={[styles.heroImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>Нет изображения</Text>
        </View>
      )}

      {/* Tour Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{tour.attributes.name}</Text>
          {tour.attributes.attributes && (
            <View
              style={[
                styles.badge,
                tour.attributes.attributes === 'new'
                  ? styles.newBadge
                  : styles.popularBadge,
              ]}
            >
              <Text style={styles.badgeText}>
                {tour.attributes.attributes === 'new' ? 'Новый' : 'Популярный'}
              </Text>
            </View>
          )}
        </View>

        {/* Meta Information */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Длительность</Text>
            <Text style={styles.metaValue}>
              ⏱️ {formatDuration(tour.attributes.durationMinutes)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Расстояние</Text>
            <Text style={styles.metaValue}>
              📍 {formatDistance(tour.attributes.distanceMeters)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Стоимость</Text>
            <Text style={styles.priceValue}>
              {formatPrice(tour.attributes.priceCents)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>
            {tour.attributes.fullDescription || tour.attributes.description}
          </Text>
        </View>

        {/* Points of Interest */}
        {pointsOfInterest.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Точки интереса ({pointsOfInterest.length})
            </Text>
            {pointsOfInterest.map((poi, index) => (
              <View key={poi.id} style={styles.poiItem}>
                <View style={styles.poiHeader}>
                  <Text style={styles.poiIndex}>{index + 1}</Text>
                  <View style={styles.poiInfo}>
                    <Text style={styles.poiName}>{poi.attributes.name}</Text>
                    {poi.attributes.isFree && (
                      <Text style={styles.freeLabel}>Бесплатно</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.poiDescription} numberOfLines={2}>
                  {poi.attributes.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Start Tour Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartTour}>
          <Text style={styles.startButtonText}>🎧 Начать тур</Text>
        </TouchableOpacity>

        {/* Free Preview Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Первые 3 точки доступны бесплатно. Для полного доступа к туру
            необходима покупка.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroImage: {
    width: screenWidth,
    height: 250,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#757575',
    fontSize: 18,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
  },
  popularBadge: {
    backgroundColor: '#FF9800',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  poiItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  poiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  poiIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  poiInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  freeLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  poiDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TourDetailScreen;
