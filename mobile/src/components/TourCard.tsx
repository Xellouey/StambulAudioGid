import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tour } from '../../../shared/types';

interface TourCardProps {
  tour: Tour;
  onPress: (tourId: number) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onPress }) => {
  const { attributes } = tour;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(tour.id)}>
      {attributes.main_image?.data && (
        <Image
          source={{ uri: attributes.main_image.data.attributes.url }}
          style={styles.image}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{attributes.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {attributes.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.attributes}>
            {attributes.attributes_tags?.map((tag, index) => (
              <View key={index} style={[styles.tag, styles[`tag_${tag}`]]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.price}>
            {attributes.priceCents > 0
              ? `${attributes.priceCents / 100} ₽`
              : 'Бесплатно'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attributes: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tag_new: {
    backgroundColor: '#e3f2fd',
  },
  tag_popular: {
    backgroundColor: '#fff3e0',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196f3',
  },
});

export default TourCard;
