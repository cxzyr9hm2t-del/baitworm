import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  FlatList,
  Alert,
  Linking,
  Platform,
} from 'react-native';

// === BAITWORM CANADA - MOBILE APP ===
// Kingston, Ontario's Premium Live Bait
// Built with React Native / Expo for iOS & Android

const CANADIAN_RED = '#d52b1e';
const DARK = '#1a1a2e';
const ACCENT = '#d4a853';
const GRAY = '#6b7280';
const LIGHT = '#faf8f5';
const WHITE = '#ffffff';

// === PRODUCT DATA ===
const PRODUCTS = [
  {
    id: '1',
    name: 'Canadian Nightcrawlers',
    emoji: '\ud83e\udeb1',
    description: 'The legendary Canadian dew worm \u2014 #1 live bait in North America. Raised in Kingston, ON.',
    prices: [
      { label: 'Dozen', price: '$5.99 CAD' },
      { label: '2 Dozen', price: '$10.99 CAD' },
      { label: 'Flat of 250', price: '$49.99 CAD' },
      { label: 'Flat of 500', price: '$89.99 CAD' },
    ],
  },
  {
    id: '2',
    name: 'European Nightcrawlers',
    emoji: '\ud83e\udeb1',
    description: 'Hardy, active worms perfect for Ontario\u2019s variable climate. Great for panfish.',
    prices: [
      { label: 'Cup of 24', price: '$5.49 CAD' },
      { label: 'Cup of 50', price: '$9.99 CAD' },
      { label: 'Bulk (per lb)', price: '$22.99 CAD' },
    ],
  },
  {
    id: '3',
    name: 'Red Wigglers',
    emoji: '\ud83d\udd34',
    description: 'Popular for panfish, perch, and ice fishing on Rideau Canal and Lake Ontario.',
    prices: [
      { label: 'Cup of 30', price: '$4.99 CAD' },
      { label: 'Cup of 50', price: '$7.49 CAD' },
      { label: '1 Pound bulk', price: '$24.99 CAD' },
    ],
  },
  {
    id: '4',
    name: 'Vermicompost',
    emoji: '\ud83c\udf31',
    description: 'Premium organic worm castings for Canadian gardens and organic farms.',
    prices: [
      { label: '5 lb bag', price: '$12.99 CAD' },
      { label: '25 lb bag', price: '$44.99 CAD' },
    ],
  },
  {
    id: '5',
    name: 'Subscription Bait Box',
    emoji: '\ud83d\udce6',
    description: 'Monthly curated live Canadian bait delivered to your door. Free shipping in Ontario!',
    prices: [
      { label: 'Monthly', price: '$29.99 CAD/mo' },
      { label: 'Seasonal (3 mo)', price: '$79.99 CAD' },
    ],
    popular: true,
  },
  {
    id: '6',
    name: 'Wholesale Programs',
    emoji: '\ud83c\udfe2',
    description: 'Supply agreements for Canadian bait shops, charter services, and retailers.',
    prices: [
      { label: 'Custom', price: 'Contact us' },
    ],
  },
];

// === FISHING SPOTS ===
const FISHING_SPOTS = [
  { name: 'Lake Ontario', type: 'Lake', distance: 'Kingston waterfront', fish: 'Walleye, Bass, Trout, Salmon' },
  { name: 'St. Lawrence River', type: 'River', distance: '5 min from Kingston', fish: 'Bass, Pike, Muskie, Walleye' },
  { name: 'Rideau Canal', type: 'Canal', distance: '15 min from Kingston', fish: 'Bass, Perch, Pike' },
  { name: 'Bay of Quinte', type: 'Bay', distance: '45 min west', fish: 'Walleye, Bass, Perch' },
  { name: 'Charleston Lake', type: 'Lake', distance: '40 min north', fish: 'Bass, Lake Trout, Pike' },
  { name: 'Rideau Lake', type: 'Lake', distance: '50 min north', fish: 'Bass, Walleye, Pike' },
];

// === MAIN APP ===
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const addToCart = (product, priceOption) => {
    setCart([...cart, { product: product.name, ...priceOption, qty: 1 }]);
    Alert.alert('Added to Cart \ud83c\udf41', product.name + ' (' + priceOption.label + ') added!');
  };

  const renderHome = () => (
    <ScrollView style={styles.screen}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>\ud83c\udf41</Text>
        <Text style={styles.heroTitle}>Baitworm Canada</Text>
        <Text style={styles.heroTagline}>Freshly Farmed in Kingston, Ontario.</Text>
        <Text style={styles.heroTagline}>Fish Approved. \ud83c\udde8\ud83c\udde6</Text>
        <Text style={styles.heroDesc}>
          Canada\u2019s premier live bait worm farm. Premium Canadian nightcrawlers and red wigglers
          delivered fresh across Ontario and nationwide.
        </Text>
        <TouchableOpacity style={styles.heroBtn} onPress={() => setActiveTab('products')}>
          <Text style={styles.heroBtnText}>Shop Canadian Bait</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>3.3M+</Text>
          <Text style={styles.statLabel}>Canadian Anglers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>$8.3B</Text>
          <Text style={styles.statLabel}>CDN Fishing Industry</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>100%</Text>
          <Text style={styles.statLabel}>Canadian Raised</Text>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Baitworm Canada?</Text>
        {[
          { icon: '\ud83c\udf41', title: '100% Canadian', desc: 'Bred and raised in Kingston, ON. Never imported.' },
          { icon: '\ud83d\ude9a', title: 'Fast Shipping', desc: 'Next-day in Eastern Ontario. 2-day across Ontario & Quebec.' },
          { icon: '\u2705', title: 'Freshness Guarantee', desc: '100% satisfaction or we make it right.' },
          { icon: '\u267b\ufe0f', title: 'Eco-Friendly', desc: 'Recyclable and compostable packaging.' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderProducts = () => (
    <FlatList
      data={PRODUCTS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.productsList}
      ListHeaderComponent={
        <Text style={styles.screenTitle}>\ud83c\udf41 Our Products</Text>
      }
      renderItem={({ item }) => (
        <View style={[styles.productCard, item.popular && styles.productCardPopular]}>
          {item.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>Most Popular</Text></View>}
          <Text style={styles.productEmoji}>{item.emoji}</Text>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDesc}>{item.description}</Text>
          {item.prices.map((p, i) => (
            <TouchableOpacity key={i} style={styles.priceRow} onPress={() => addToCart(item, p)}>
              <Text style={styles.priceLabel}>{p.label}</Text>
              <Text style={styles.priceValue}>{p.price}</Text>
              <Text style={styles.addBtn}>+ Add</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    />
  );

  const renderSpots = () => (
    <FlatList
      data={FISHING_SPOTS}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.productsList}
      ListHeaderComponent={
        <View>
          <Text style={styles.screenTitle}>\ud83c\udf0a Ontario Fishing Spots</Text>
          <Text style={styles.spotsSubtitle}>Near Kingston, Ontario</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.spotCard}>
          <View style={styles.spotHeader}>
            <Text style={styles.spotName}>{item.name}</Text>
            <View style={styles.spotBadge}>
              <Text style={styles.spotBadgeText}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.spotDistance}>{item.distance}</Text>
          <Text style={styles.spotFish}>\ud83c\udf0a {item.fish}</Text>
        </View>
      )}
    />
  );

  const renderCart = () => (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>\ud83d\uded2 Your Cart</Text>
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartEmoji}>\ud83e\udeb1</Text>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => setActiveTab('products')}>
            <Text style={styles.heroBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {cart.map((item, i) => (
            <View key={i} style={styles.cartItem}>
              <View>
                <Text style={styles.cartItemName}>{item.product}</Text>
                <Text style={styles.cartItemOption}>{item.label}</Text>
              </View>
              <Text style={styles.cartItemPrice}>{item.price}</Text>
            </View>
          ))}
          <Text style={styles.cartNote}>All prices in Canadian dollars (CAD)</Text>
          <Text style={styles.cartNote}>Free shipping on orders over $75 CAD</Text>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutBtnText}>Checkout \ud83c\udde8\ud83c\udde6</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderContact = () => (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>\ud83d\udce7 Contact Us</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactLine}>\ud83d\udccd Kingston, Ontario, Canada K7L</Text>
        <Text style={styles.contactLine}>\ud83d\udce7 info@baitworm.ca</Text>
        <Text style={styles.contactLine}>\ud83d\udcde (613) 555-BAIT</Text>
        <Text style={styles.contactLine}>\ud83d\udd52 Mon-Fri 7AM-5PM | Sat 7AM-12PM EST</Text>
      </View>
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={contactForm.name}
          onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          keyboardType="email-address"
          value={contactForm.email}
          onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your Message"
          multiline
          numberOfLines={4}
          value={contactForm.message}
          onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
        />
        <TouchableOpacity
          style={styles.heroBtn}
          onPress={() => {
            Alert.alert('Message Sent \ud83c\udf41', 'Thank you! We\u2019ll get back to you soon.');
            setContactForm({ name: '', email: '', message: '' });
          }}
        >
          <Text style={styles.heroBtnText}>Send Message</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.serviceAreas}>
        <Text style={styles.serviceTitle}>Service Areas</Text>
        <Text style={styles.serviceText}>
          Kingston \u2022 Ottawa \u2022 Toronto \u2022 Montreal \u2022 All of Ontario \u2022 Nationwide across Canada
        </Text>
      </View>
    </ScrollView>
  );

  const screens = {
    home: renderHome,
    products: renderProducts,
    spots: renderSpots,
    cart: renderCart,
    contact: renderContact,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>\ud83c\udf41 Baitworm Canada</Text>
        <Text style={styles.headerSub}>Kingston, ON \ud83c\udde8\ud83c\udde6</Text>
      </View>

      {/* Active Screen */}
      <View style={styles.content}>
        {screens[activeTab]()}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { key: 'home', label: 'Home', icon: '\ud83c\udfe0' },
          { key: 'products', label: 'Products', icon: '\ud83e\udeb1' },
          { key: 'spots', label: 'Spots', icon: '\ud83c\udf0a' },
          { key: 'cart', label: 'Cart', icon: '\ud83d\uded2' },
          { key: 'contact', label: 'Contact', icon: '\ud83d\udce7' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    backgroundColor: DARK,
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: CANADIAN_RED,
  },
  headerLogo: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    color: GRAY,
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 20,
  },

  // Hero
  hero: {
    backgroundColor: CANADIAN_RED,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: WHITE,
    textAlign: 'center',
  },
  heroTagline: {
    fontSize: 16,
    color: ACCENT,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  heroBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 20,
  },
  heroBtnText: {
    color: DARK,
    fontWeight: '700',
    fontSize: 16,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderTopWidth: 3,
    borderTopColor: CANADIAN_RED,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: CANADIAN_RED,
  },
  statLabel: {
    fontSize: 10,
    color: GRAY,
    textAlign: 'center',
    marginTop: 4,
  },

  // Section
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK,
    marginBottom: 16,
    textAlign: 'center',
  },

  // Features
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
  },
  featureDesc: {
    fontSize: 13,
    color: GRAY,
    marginTop: 2,
  },

  // Products
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: DARK,
    textAlign: 'center',
    marginVertical: 20,
  },
  productsList: {
    padding: 20,
  },
  productCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productCardPopular: {
    borderWidth: 2,
    borderColor: CANADIAN_RED,
  },
  popularBadge: {
    backgroundColor: CANADIAN_RED,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  popularText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  productEmoji: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
    textAlign: 'center',
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 13,
    color: GRAY,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 14,
    color: DARK,
    flex: 1,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: CANADIAN_RED,
    marginRight: 12,
  },
  addBtn: {
    color: ACCENT,
    fontWeight: '700',
    fontSize: 14,
  },

  // Spots
  spotsSubtitle: {
    textAlign: 'center',
    color: GRAY,
    marginBottom: 16,
    marginTop: -12,
  },
  spotCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: CANADIAN_RED,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  spotName: {
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
  },
  spotBadge: {
    backgroundColor: LIGHT,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  spotBadgeText: {
    fontSize: 11,
    color: CANADIAN_RED,
    fontWeight: '600',
  },
  spotDistance: {
    fontSize: 13,
    color: GRAY,
    marginBottom: 4,
  },
  spotFish: {
    fontSize: 13,
    color: DARK,
  },

  // Cart
  emptyCart: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyCartEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 18,
    color: GRAY,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
  },
  cartItemOption: {
    fontSize: 13,
    color: GRAY,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: CANADIAN_RED,
  },
  cartNote: {
    textAlign: 'center',
    color: GRAY,
    fontSize: 12,
    marginTop: 8,
  },
  checkoutBtn: {
    backgroundColor: CANADIAN_RED,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
  },

  // Contact
  contactInfo: {
    backgroundColor: LIGHT,
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  contactLine: {
    fontSize: 14,
    color: DARK,
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  serviceAreas: {
    backgroundColor: LIGHT,
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CANADIAN_RED,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 13,
    color: GRAY,
    lineHeight: 20,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: DARK,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: CANADIAN_RED,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabActive: {
    borderTopWidth: 0,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: GRAY,
  },
  tabLabelActive: {
    color: CANADIAN_RED,
    fontWeight: '600',
  },
});
