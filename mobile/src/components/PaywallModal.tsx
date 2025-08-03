import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface PaywallModalProps {
  visible: boolean;
  tourName: string;
  price: number;
  onPurchase: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  tourName,
  price,
  onPurchase,
  onClose,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Разблокировать полный тур</Text>
          <Text style={styles.tourName}>{tourName}</Text>

          <View style={styles.features}>
            <Text style={styles.featureItem}>
              ✓ Полный доступ ко всем точкам интереса
            </Text>
            <Text style={styles.featureItem}>✓ Аудиогид на всем маршруте</Text>
            <Text style={styles.featureItem}>
              ✓ Подробные описания достопримечательностей
            </Text>
            <Text style={styles.featureItem}>✓ Навигация по маршруту</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Цена:</Text>
            <Text style={styles.price}>{price / 100} ₽</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.purchaseButton]}
              onPress={onPurchase}
              disabled={isLoading}
            >
              <Text style={styles.purchaseButtonText}>
                {isLoading ? 'Обработка...' : 'Купить'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 350,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  tourName: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  buttons: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  purchaseButton: {
    backgroundColor: '#2196f3',
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PaywallModal;
