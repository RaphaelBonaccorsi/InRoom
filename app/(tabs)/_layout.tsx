// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#11324e',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#aaaaaa',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'login':
              iconName = focused ? 'log-in' : 'log-in-outline';
              break;
            case 'register':
              iconName = focused ? 'person-add' : 'person-add-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="login" options={{ title: 'Login' }} />
      <Tabs.Screen name="register" options={{ title: 'Cadastro' }} />
    </Tabs>
  );
}
