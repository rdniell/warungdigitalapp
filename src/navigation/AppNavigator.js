import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CartScreen from '../screens/CartScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../constants/colors';

const RootStack = createNativeStackNavigator();
const CatalogStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackHeaderOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '600' },
};

function CatalogStackNavigator() {
  return (
    <CatalogStack.Navigator screenOptions={stackHeaderOptions}>
      <CatalogStack.Screen
        name="CatalogList"
        component={CatalogScreen}
        options={{ title: 'Katalog Produk' }}
      />
      <CatalogStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Detail Produk' }}
      />
      <CatalogStack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Tambah Produk' }}
      />
    </CatalogStack.Navigator>
  );
}

const TAB_ICONS = {
  Katalog: 'storefront-outline',
  Keranjang: 'cart-outline',
  Riwayat: 'time-outline',
  Profil: 'person-outline',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
        ...stackHeaderOptions,
      })}
    >
      <Tab.Screen
        name="Katalog"
        component={CatalogStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Keranjang" component={CartScreen} options={{ title: 'Keranjang' }} />
      <Tab.Screen
        name="Riwayat"
        component={HistoryScreen}
        options={{ title: 'Riwayat Transaksi' }}
      />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Main" component={MainTabs} />
    </RootStack.Navigator>
  );
}
