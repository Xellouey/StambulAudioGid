import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { UserLocation } from '../../../shared/types';

const useLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Разрешение на геолокацию',
            message:
              'Приложению нужен доступ к вашему местоположению для навигации по туру',
            buttonNeutral: 'Спросить позже',
            buttonNegative: 'Отмена',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setError('Доступ к геолокации отклонен');
          setLoading(false);
        }
      } else {
        // iOS permissions are handled automatically by the system
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setError('Ошибка запроса разрешения на геолокацию');
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    // TODO: Implement with react-native-geolocation-service or similar
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       accuracy: position.coords.accuracy,
    //     });
    //     setLoading(false);
    //   },
    //   (error) => {
    //     console.error('Error getting location:', error);
    //     setError('Не удалось получить местоположение');
    //     setLoading(false);
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 15000,
    //     maximumAge: 10000,
    //   }
    // );

    // Mock location for development
    setTimeout(() => {
      setLocation({
        latitude: 42.9849, // Makhachkala coordinates
        longitude: 47.5047,
        accuracy: 10,
      });
      setLoading(false);
    }, 1000);
  };

  const watchLocation = (callback: (location: UserLocation) => void) => {
    // TODO: Implement location watching
    // const watchId = navigator.geolocation.watchPosition(
    //   (position) => {
    //     const newLocation = {
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       accuracy: position.coords.accuracy,
    //     };
    //     setLocation(newLocation);
    //     callback(newLocation);
    //   },
    //   (error) => {
    //     console.error('Error watching location:', error);
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     distanceFilter: 10, // Update every 10 meters
    //   }
    // );

    // return () => navigator.geolocation.clearWatch(watchId);

    console.log('Location watching started');
    return () => console.log('Location watching stopped');
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation,
  };
};

export default useLocation;
