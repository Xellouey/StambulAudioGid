import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Tour } from '../types';
import { useTours } from '../hooks';
import { LoadingSpinner } from '../components';
import {
  formatDuration,
  formatDistance,
  formatPrice,
  getImageUrl,
} from '../utils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { tours, isLoading, error, refreshTours } = useTours();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshTours();
    setIsRefreshing(false);
  }, [refreshTours]);

  const renderTourItem = ({ item }: { item: Tour }) => {
    const imageUrl = item.attributes.main_image?.data?.attributes?.url;
    const fullImageUrl = getImageUrl(imageUrl);

    return (
      <TouchableOpacity
        style={styles.tourCard}
        onPress={() => navigation.navigate('TourDetail', { tourId: item.id })}
      >
        {fullImageUrl ? (
          <Image source={{ uri: fullImageUrl }} style={styles.tourImage} />
        ) : (
          <View style={[styles.tourImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Нет изображения</Text>
          </View>
        )}

        <View style={styles.tourInfo}>
          <View style={styles.tourHeader}>
            <Text style={styles.tourTitle} numberOfLines={2}>
              {item.attributes.name}
            </Text>
            {item.attributes.attributes && (
              <View
                style={[
                  styles.badge,
                  item.attributes.attributes === 'new'
                    ? styles.newBadge
                    : styles.popularBadge,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.attributes.attributes === 'new'
                    ? 'Новый'
                    : 'Популярный'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.tourDescription} numberOfLines={3}>
            {item.attributes.description}
          </Text>

          <View style={styles.tourMeta}>
            <Text style={styles.metaText}>
              ⏱️ {formatDuration(item.attributes.durationMinutes)}
            </Text>
            <Text style={styles.metaText}>
              📍 {formatDistance(item.attributes.distanceMeters)}
            </Text>
            <Text style={styles.priceText}>
              {formatPrice(item.attributes.priceCents)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner message="Загрузка туров..." />;
  }

  if (error && tours.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>😔 {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshTours}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tours}
        renderItem={renderTourItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  tourCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tourImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#757575',
    fontSize: 16,
  },
  tourInfo: {
    padding: 16,
  },
  tourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  tourDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tourMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
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

export default HomeScreen;
