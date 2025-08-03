import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, TourDetailScreen, MapScreen } from '../screens';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Аудиогид по Дагестану',
          }}
        />
        <Stack.Screen
          name="TourDetail"
          component={TourDetailScreen}
          options={{
            title: 'Детали тура',
          }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={({ route }) => ({
            title: route.params.tourName,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
