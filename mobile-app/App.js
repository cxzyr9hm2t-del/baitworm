import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput,
  StatusBar, FlatList, Alert, Linking, Platform, Animated, RefreshControl,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const CANADIAN_RED = '#d52b1e';
const DARK = '#1a1a2e';
const ACCENT = '#d4a853';
const GRAY = '#6b7280';
const LIGHT = '#faf8f5';
const WHITE = '#ffffff';

const Tab = createBottomTabNavigator();

const PRODUCTS = [
  {
    id: '1', name: 'Canadian Nightcrawlers', emoji: '\ud83e\udeb1',
    description: 'The legendary Canadian dew worm \u2014 #1 live bait in North America. Raised in Kingston, ON.',
    prices: [
      { label: 'Dozen', price: '$5.99 CAD', value: 5.99 },
      { label: '2 Dozen', price: '$10.99 CAD', value: 10.99 },
      { label: 'Flat of 250', price: '$49.99 CAD', value: 49.99 },
      { label: 'Flat of 500', price: '$89.99 CAD', value: 89.99 },
    ],
  },
  {
    id: '2', name: 'European Nightcrawlers', emoji: '\ud83e\udeb1',
    description: 'Hardy, active worms perfect for Ontario\u2019s variable climate. Great for panfish.',
    prices: [
      { label: 'Cup of 24', price: '$5.49 CAD', value: 5.49 },
      { label: 'Cup of 50', price: '$9.99 CAD', value: 9.99 },
      { label: 'Bulk (per lb)', price: '$22.99 CAD', value: 22.99 },
    ],
  },
  {
    id: '3', name: 'Red Wigglers', emoji: '\ud83d\udd34',
    description: 'Popular for panfish, perch, and ice fishing on Rideau Canal and Lake Ontario.',
    prices: [
      { label: 'Cup of 30', price: '$4.99 CAD', value: 4.99 },
      { label: 'Cup of 50', price: '$7.49 CAD', value: 7.49 },
      { label: '1 Pound bulk', price: '$24.99 CAD', value: 24.99 },
    ],
  },
  {
    id: '4', name: 'Vermicompost', emoji: '\ud83c\udf31',
    description: 'Premium organic worm castings for Canadian gardens and organic farms.',
    prices: [
      { label: '5 lb bag', price: '$12.99 CAD', value: 12.99 },
      { label: '25 lb bag', price: '$44.99 CAD', value: 44.99 },
    ],
  },
  {
    id: '5', name: 'Subscription Bait Box', emoji: '\ud83d\udce6',
    description: 'Monthly curated live Canadian bait delivered to your door. Free shipping in Ontario!',
    prices: [
      { label: 'Monthly', price: '$29.99 CAD/mo', value: 29.99 },
      { label: 'Seasonal (3 mo)', price: '$79.99 CAD', value: 79.99 },
    ],
    popular: true,
  },
  {
    id: '6', name: 'Wholesale Programs', emoji: '\ud83c\udfe2',
    description: 'Supply agreements for Canadian bait shops, charter services, and retailers.',
    prices: [{ label: 'Custom', price: 'Contact us', value: 0 }],
  },
];

const FISHING_SPOTS = [
  { name: 'Lake Ontario', type: 'Lake', distance: 'Kingston waterfront', fish: 'Walleye, Bass, Trout, Salmon', coords: { lat: 44.2312, lng: -76.4860 } },
  { name: 'St. Lawrence River', type: 'River', distance: '5 min from Kingston', fish: 'Bass, Pike, Muskie, Walleye', coords: { lat: 44.2338, lng: -76.4735 } },
  { name: 'Rideau Canal', type: 'Canal', distance: '15 min from Kingston', fish: 'Bass, Perch, Pike', coords: { lat: 44.3400, lng: -76.3600 } },
  { name: 'Bay of Quinte', type: 'Bay', distance: '45 min west', fish: 'Walleye, Bass, Perch', coords: { lat: 44.1700, lng: -77.1500 } },
  { name: 'Charleston Lake', type: 'Lake', distance: '40 min north', fish: 'Bass, Lake Trout, Pike', coords: { lat: 44.5000, lng: -76.0400 } },
  { name: 'Rideau Lake', type: 'Lake', distance: '50 min north', fish: 'Bass, Walleye, Pike', coords: { lat: 44.6700, lng: -76.2200 } },
];

// === SHARED CART STATE ===
let globalCart = [];
let cartListeners = [];

function useCart() {
  const [cart, setCart] = useState(globalCart);
  const listener = useCallback(() => setCart([...globalCart]), []);
  React.useEffect(() => {
    cartListeners.push(listener);
    return () => { cartListeners = cartListeners.filter(l => l !== listener); };
  }, [listener]);
  const notifyAll = () => cartListeners.forEach(l => l());

  const addToCart = (product, priceOption) => {
    const existing = globalCart.find(i => i.product === product.name && i.label === priceOption.label);
    if (existing) { existing.qty += 1; }
    else { globalCart.push({ product: product.name, ...priceOption, qty: 1 }); }
    notifyAll();
    Alert.alert('Added to Cart \ud83c\udf41', product.name + ' (' + priceOption.label + ') added!');
  };
  const removeFromCart = (index) => { globalCart.splice(index, 1); notifyAll(); };
  const updateQty = (index, delta) => {
    globalCart[index].qty += delta;
    if (globalCart[index].qty <= 0) globalCart.splice(index, 1);
    notifyAll();
  };
  const clearCart = () => { globalCart = []; notifyAll(); };
  const total = cart.reduce((sum, item) => sum + (item.value || 0) * item.qty, 0);
  return { cart, addToCart, removeFromCart, updateQty, clearCart, total };
}

// === SCREENS ===
function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <Animated.ScrollView
      style={[styles.screen, { opacity: fadeAnim }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CANADIAN_RED} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>\ud83c\udf41</Text>
        <Text style={styles.heroTitle}>Baitworm Canada</Text>
        <Text style={styles.heroTagline}>Freshly Farmed in Kingston, Ontario.</Text>
        <Text style={styles.heroTagline}>Fish Approved. \ud83c\udde8\ud83c\udde6</Text>
        <Text style={styles.heroDesc}>
          Canada\u2019s premier live bait worm farm. Premium Canadian nightcrawlers and red wigglers delivered fresh across Ontario and nationwide.
        </Text>
        <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Products')} activeOpacity={0.8}>
          <Text style={styles.heroBtnText}>Shop Canadian Bait</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { num: '3.3M+', label: 'Canadian Anglers' },
          { num: '$8.3B', label: 'CDN Fishing Industry' },
          { num: '100%', label: 'Canadian Raised' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Baitworm Canada?</Text>
        {[
          { icon: '\ud83c\udf41', title: '100% Canadian', desc: 'Bred and raised in Kingston, ON. Never imported.' },
          { icon: '\ud83d\ude9a', title: 'Fast Shipping', desc: 'Next-day in Eastern Ontario. 2-day across Ontario & Quebec.' },
          { icon: '\u2705', title: 'Freshness Guarantee', desc: '100% satisfaction or we make it right.' },
          { icon: '\u267b\ufe0f', title: 'Eco-Friendly', desc: 'Recyclable and compostable packaging.' },
        ].map((f, i) => (
          <TouchableOpacity key={i} style={styles.featureRow} activeOpacity={0.7}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Fish?</Text>
        <Text style={styles.ctaDesc}>Order fresh Canadian bait today and get free shipping on orders over $75 CAD.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Products')} activeOpacity={0.8}>
          <Text style={styles.ctaBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 30 }} />
    </Animated.ScrollView>
  );
}

function ProductsScreen() {
  const { addToCart } = useCart();
  return (
    <FlatList
      data={PRODUCTS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.productsList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Text style={styles.screenTitle}>\ud83c\udf41 Our Products</Text>}
      renderItem={({ item }) => (
        <View style={[styles.productCard, item.popular && styles.productCardPopular]}>
          {item.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>Most Popular</Text></View>}
          <Text style={styles.productEmoji}>{item.emoji}</Text>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDesc}>{item.description}</Text>
          {item.prices.map((p, i) => (
            <TouchableOpacity key={i} style={styles.priceRow} onPress={() => addToCart(item, p)} activeOpacity={0.6}>
              <Text style={styles.priceLabel}>{p.label}</Text>
              <Text style={styles.priceValue}>{p.price}</Text>
              <View style={styles.addBtnWrap}><Text style={styles.addBtn}>+ Add</Text></View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    />
  );
}

function SpotsScreen() {
  const openMap = (spot) => {
    const url = Platform.select({
      ios: 'maps:?q=' + spot.name + '&ll=' + spot.coords.lat + ',' + spot.coords.lng,
      android: 'geo:' + spot.coords.lat + ',' + spot.coords.lng + '?q=' + spot.name,
    });
    Linking.openURL(url).catch(() =>
      Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + spot.coords.lat + ',' + spot.coords.lng)
    );
  };
  return (
    <FlatList
      data={FISHING_SPOTS}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.productsList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <Text style={styles.screenTitle}>\ud83c\udf0a Ontario Fishing Spots</Text>
          <Text style={styles.spotsSubtitle}>Near Kingston, Ontario</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.spotCard} onPress={() => openMap(item)} activeOpacity={0.7}>
          <View style={styles.spotHeader}>
            <Text style={styles.spotName}>{item.name}</Text>
            <View style={styles.spotBadge}><Text style={styles.spotBadgeText}>{item.type}</Text></View>
          </View>
          <Text style={styles.spotDistance}>{item.distance}</Text>
          <Text style={styles.spotFish}>\ud83c\udf0a {item.fish}</Text>
          <Text style={styles.spotMapLink}>Tap to open in Maps \u2192</Text>
        </TouchableOpacity>
      )}
    />
  );
}

function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const freeShipping = total >= 75;
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>\ud83d\uded2 Your Cart</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartEmoji}>\ud83e\udeb1</Text>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Products')} activeOpacity={0.8}>
            <Text style={styles.heroBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {cart.map((item, i) => (
            <View key={i} style={styles.cartItem}>
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.product}</Text>
                <Text style={styles.cartItemOption}>{item.label}</Text>
              </View>
              <View style={styles.cartItemActions}>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(i, -1)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{item.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(i, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartItemPrice}>{item.price}</Text>
                <TouchableOpacity onPress={() => removeFromCart(i)}>
                  <Text style={styles.removeBtn}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.cartSummary}>
            <View style={styles.cartSummaryRow}>
              <Text style={styles.cartSummaryLabel}>Subtotal:</Text>
              <Text style={styles.cartSummaryValue}>{'$'}{total.toFixed(2)} CAD</Text>
            </View>
            <View style={styles.cartSummaryRow}>
              <Text style={styles.cartSummaryLabel}>Shipping:</Text>
              <Text style={[styles.cartSummaryValue, freeShipping && styles.freeShipping]}>
                {freeShipping ? 'FREE' : 'Calculated at checkout'}
              </Text>
            </View>
            {!freeShipping && (
              <Text style={styles.shippingNote}>Add {'$'}{(75 - total).toFixed(2)} more for free shipping!</Text>
            )}
          </View>

          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
            <Text style={styles.checkoutBtnText}>Checkout \ud83c\udde8\ud83c\udde6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearCartBtn} onPress={() => {
            Alert.alert('Clear Cart', 'Remove all items?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]);
          }}>
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function ContactScreen() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields before sending.');
      return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      Alert.alert('Message Sent \ud83c\udf41', 'Thank you! We\u2019ll get back to you within 24 hours.');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={styles.screenTitle}>\ud83d\udce7 Contact Us</Text>
      <View style={styles.contactInfo}>
        <TouchableOpacity onPress={() => Linking.openURL('https://maps.google.com/?q=Kingston+Ontario+Canada+K7L')}>
          <Text style={styles.contactLine}>\ud83d\udccd Kingston, Ontario, Canada K7L</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:info@baitworm.ca')}>
          <Text style={[styles.contactLine, styles.contactLink]}>\ud83d\udce7 info@baitworm.ca</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+16135552248')}>
          <Text style={[styles.contactLine, styles.contactLink]}>\ud83d\udcde (613) 555-BAIT</Text>
        </TouchableOpacity>
        <Text style={styles.contactLine}>\ud83d\udd52 Mon-Fri 7AM-5PM | Sat 7AM-12PM EST</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Your Name</Text>
        <TextInput style={styles.input} placeholder="John Smith" placeholderTextColor="#9ca3af"
          value={contactForm.name} onChangeText={(text) => setContactForm({ ...contactForm, name: text })} />
        <Text style={styles.formLabel}>Your Email</Text>
        <TextInput style={styles.input} placeholder="john@example.com" placeholderTextColor="#9ca3af"
          keyboardType="email-address" autoCapitalize="none"
          value={contactForm.email} onChangeText={(text) => setContactForm({ ...contactForm, email: text })} />
        <Text style={styles.formLabel}>Your Message</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="How can we help you?" placeholderTextColor="#9ca3af"
          multiline numberOfLines={4}
          value={contactForm.message} onChangeText={(text) => setContactForm({ ...contactForm, message: text })} />
        <TouchableOpacity style={[styles.heroBtn, sending && styles.disabledBtn]}
          onPress={handleSubmit} disabled={sending} activeOpacity={0.8}>
          <Text style={styles.heroBtnText}>{sending ? 'Sending...' : sent ? 'Sent!' : 'Send Message'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceAreas}>
        <Text style={styles.serviceTitle}>Service Areas</Text>
        <Text style={styles.serviceText}>
          Kingston \u2022 Ottawa \u2022 Toronto \u2022 Montreal \u2022 All of Ontario \u2022 Nationwide across Canada
        </Text>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// === MAIN APP ===
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={DARK} />
      <View style={styles.header}>
        <Text style={styles.headerLogo}>\ud83c\udf41 Baitworm Canada</Text>
        <Text style={styles.headerSub}>Kingston, ON \ud83c\udde8\ud83c\udde6</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: CANADIAN_RED,
          tabBarInactiveTintColor: GRAY,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>\ud83c\udfe0</Text> }} />
        <Tab.Screen name="Products" component={ProductsScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>\ud83e\udeb1</Text> }} />
        <Tab.Screen name="Spots" component={SpotsScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>\ud83c\udf0a</Text> }} />
        <Tab.Screen name="Cart" component={CartScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>\ud83d\uded2</Text> }} />
        <Tab.Screen name="Contact" component={ContactScreen}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>\ud83d\udce7</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  header: {
    backgroundColor: DARK,
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: CANADIAN_RED,
  },
  headerLogo: { color: WHITE, fontSize: 20, fontWeight: '800' },
  headerSub: { color: GRAY, fontSize: 12, marginTop: 2 },
  screen: { flex: 1, padding: 20, backgroundColor: WHITE },
  tabBar: {
    backgroundColor: DARK,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: CANADIAN_RED,
    height: Platform.OS === 'ios' ? 85 : 65,
  },
  hero: {
    backgroundColor: CANADIAN_RED, borderRadius: 16, padding: 30, alignItems: 'center', marginBottom: 20,
    elevation: 4, shadowColor: CANADIAN_RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  heroEmoji: { fontSize: 48, marginBottom: 10 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: WHITE, textAlign: 'center' },
  heroTagline: { fontSize: 16, color: ACCENT, fontStyle: 'italic', textAlign: 'center' },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  heroBtn: { backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10, marginTop: 20 },
  heroBtnText: { color: DARK, fontWeight: '700', fontSize: 16 },
  disabledBtn: { opacity: 0.6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    backgroundColor: WHITE, borderRadius: 12, padding: 15, alignItems: 'center', flex: 1, marginHorizontal: 4,
    borderTopWidth: 3, borderTopColor: CANADIAN_RED,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  statNum: { fontSize: 20, fontWeight: '800', color: CANADIAN_RED },
  statLabel: { fontSize: 10, color: GRAY, textAlign: 'center', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: DARK, marginBottom: 16, textAlign: 'center' },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: LIGHT, borderRadius: 12, padding: 16, marginBottom: 10,
  },
  featureIcon: { fontSize: 28, marginRight: 14 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: DARK },
  featureDesc: { fontSize: 13, color: GRAY, marginTop: 2 },
  ctaSection: {
    backgroundColor: DARK, borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 10,
  },
  ctaTitle: { fontSize: 22, fontWeight: '800', color: WHITE, marginBottom: 8 },
  ctaDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20 },
  ctaBtn: { backgroundColor: CANADIAN_RED, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10, marginTop: 16 },
  ctaBtnText: { color: WHITE, fontWeight: '700', fontSize: 16 },
  screenTitle: { fontSize: 24, fontWeight: '800', color: DARK, textAlign: 'center', marginVertical: 20 },
  productsList: { padding: 20 },
  productCard: {
    backgroundColor: WHITE, borderRadius: 16, padding: 20, marginBottom: 16,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6,
  },
  productCardPopular: { borderWidth: 2, borderColor: CANADIAN_RED },
  popularBadge: { backgroundColor: CANADIAN_RED, alignSelf: 'center', paddingVertical: 4, paddingHorizontal: 14, borderRadius: 12, marginBottom: 10 },
  popularText: { color: WHITE, fontSize: 12, fontWeight: '600' },
  productEmoji: { fontSize: 36, textAlign: 'center', marginBottom: 8 },
  productName: { fontSize: 18, fontWeight: '700', color: DARK, textAlign: 'center', marginBottom: 6 },
  productDesc: { fontSize: 13, color: GRAY, textAlign: 'center', marginBottom: 14, lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  priceLabel: { fontSize: 14, color: DARK, flex: 1 },
  priceValue: { fontSize: 14, fontWeight: '600', color: CANADIAN_RED, marginRight: 12 },
  addBtnWrap: { backgroundColor: ACCENT, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6 },
  addBtn: { color: DARK, fontWeight: '700', fontSize: 13 },
  spotsSubtitle: { textAlign: 'center', color: GRAY, marginBottom: 16, marginTop: -12 },
  spotCard: {
    backgroundColor: WHITE, borderRadius: 14, padding: 18, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: CANADIAN_RED,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3,
  },
  spotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  spotName: { fontSize: 17, fontWeight: '700', color: DARK },
  spotBadge: { backgroundColor: LIGHT, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 8 },
  spotBadgeText: { fontSize: 11, color: CANADIAN_RED, fontWeight: '600' },
  spotDistance: { fontSize: 13, color: GRAY, marginBottom: 4 },
  spotFish: { fontSize: 13, color: DARK },
  spotMapLink: { fontSize: 12, color: ACCENT, marginTop: 6, fontWeight: '600' },
  emptyCart: { alignItems: 'center', marginTop: 60 },
  emptyCartEmoji: { fontSize: 64, marginBottom: 16 },
  emptyCartText: { fontSize: 18, color: GRAY, marginBottom: 20 },
  cartItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: LIGHT, borderRadius: 12, padding: 16, marginBottom: 10,
  },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 15, fontWeight: '600', color: DARK },
  cartItemOption: { fontSize: 13, color: GRAY },
  cartItemActions: { alignItems: 'flex-end' },
  cartItemPrice: { fontSize: 16, fontWeight: '700', color: CANADIAN_RED, marginVertical: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: DARK, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: WHITE, fontSize: 16, fontWeight: '700' },
  qtyNum: { fontSize: 16, fontWeight: '700', color: DARK, marginHorizontal: 12 },
  removeBtn: { color: CANADIAN_RED, fontSize: 12, marginTop: 4 },
  cartSummary: { backgroundColor: LIGHT, borderRadius: 12, padding: 16, marginTop: 12 },
  cartSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cartSummaryLabel: { fontSize: 15, color: GRAY },
  cartSummaryValue: { fontSize: 15, fontWeight: '700', color: DARK },
  freeShipping: { color: '#22c55e' },
  shippingNote: { fontSize: 12, color: ACCENT, textAlign: 'center', marginTop: 4 },
  checkoutBtn: { backgroundColor: CANADIAN_RED, paddingVertical: 16, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  checkoutBtnText: { color: WHITE, fontSize: 18, fontWeight: '700' },
  clearCartBtn: { alignItems: 'center', marginTop: 12, paddingVertical: 8 },
  clearCartText: { color: GRAY, fontSize: 14 },
  contactInfo: { backgroundColor: LIGHT, borderRadius: 14, padding: 20, marginBottom: 20 },
  contactLine: { fontSize: 14, color: DARK, marginBottom: 10, lineHeight: 20 },
  contactLink: { color: CANADIAN_RED, textDecorationLine: 'underline' },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 13, fontWeight: '600', color: DARK, marginBottom: 4, marginLeft: 4 },
  input: {
    backgroundColor: WHITE, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginBottom: 12, color: DARK,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  serviceAreas: { backgroundColor: LIGHT, borderRadius: 14, padding: 20, marginBottom: 20 },
  serviceTitle: { fontSize: 16, fontWeight: '700', color: CANADIAN_RED, marginBottom: 8 },
  serviceText: { fontSize: 13, color: GRAY, lineHeight: 20 },
});
