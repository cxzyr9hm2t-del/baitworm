import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput,
  StatusBar, FlatList, Alert, Linking, Platform, Animated, RefreshControl,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Baitworm Canada - Soft Bait Worms
// Handcrafted in Kingston, Ontario

const INK = '#1c1c1c';
const INK_LIGHT = '#3a3a3a';
const STONE = '#a8a29e';
const SAND = '#f5f0eb';
const CREAM = '#faf8f5';
const WHITE = '#ffffff';
const RUST = '#b45309';
const RUST_LIGHT = '#d97706';

const Tab = createBottomTabNavigator();

const PRODUCTS = [
  { id: '1', name: 'The Kingston Crawler', desc: 'Our signature 6\" soft plastic worm. Ribbed body with a paddle tail.', tag: '6\" | 8-pack', price: '$8.99', value: 8.99 },
  { id: '2', name: 'Rideau Ribbon Tail', desc: 'Classic ribbon tail worm with a slender profile. Deadly on a drop shot.', tag: '5\" | 10-pack', price: '$7.99', value: 7.99 },
  { id: '3', name: 'St. Lawrence Shad', desc: 'Paddle tail swimbait with a tight wobble. Salt-loaded for distance.', tag: '4\" | 6-pack', price: '$9.49', value: 9.49 },
  { id: '4', name: 'Quinte Craw', desc: 'Compact creature bait with realistic claw action for flipping.', tag: '3.5\" | 8-pack', price: '$8.49', value: 8.49 },
  { id: '5', name: 'Limestone Grub', desc: 'Straight-tail grub that excels on a jig head. Simple, deadly.', tag: '3\" | 12-pack', price: '$6.99', value: 6.99 },
  { id: '6', name: 'Custom Colour Pour', desc: 'Your colour, your formula. We pour a custom batch just for you.', tag: 'Custom | Min 5 packs', price: '$12.99', value: 12.99 },
];

let globalCart = [];
let cartListeners = [];
function useCart() {
  const [cart, setCart] = useState(globalCart);
  const listener = useCallback(() => setCart([...globalCart]), []);
  React.useEffect(() => {
    cartListeners.push(listener);
    return () => { cartListeners = cartListeners.filter(l => l !== listener); };
  }, [listener]);
  const notify = () => cartListeners.forEach(l => l());
  const addToCart = (p) => {
    const ex = globalCart.find(i => i.name === p.name);
    if (ex) ex.qty += 1; else globalCart.push({ ...p, qty: 1 });
    notify(); Alert.alert('Added', p.name + ' added to cart.');
  };
  const remove = (i) => { globalCart.splice(i, 1); notify(); };
  const updateQty = (i, d) => { globalCart[i].qty += d; if (globalCart[i].qty <= 0) globalCart.splice(i, 1); notify(); };
  const clear = () => { globalCart = []; notify(); };
  const total = cart.reduce((s, i) => s + (i.value || 0) * i.qty, 0);
  return { cart, addToCart, remove, updateQty, clear, total };
}

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={s.screen}>
      <View style={s.hero}>
        <Text style={s.eyebrow}>Kingston, Ontario</Text>
        <Text style={s.heroTitle}>Born in a Garage.{"\n"}Built for the Water.</Text>
        <Text style={s.heroDesc}>We pour premium soft bait worms by hand in a Kingston garage. Every bait is crafted with care and tested on local waters.</Text>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Baits')}>
          <Text style={s.btnText}>Shop Soft Baits</Text>
        </TouchableOpacity>
      </View>
      <View style={s.values}>
        {[{ n: '01', t: 'Hand-Poured', d: 'Every bait poured by hand. No machines.' },
          { n: '02', t: 'Field-Tested', d: 'Tested on Lake Ontario, St. Lawrence, Rideau.' },
          { n: '03', t: 'Kingston Proud', d: 'We live, fish, and build here.' }].map((v, i) => (
          <View key={i} style={s.valueCard}>
            <Text style={s.valueNum}>{v.n}</Text>
            <Text style={s.valueTitle}>{v.t}</Text>
            <Text style={s.valueDesc}>{v.d}</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function BaitsScreen() {
  const { addToCart } = useCart();
  return (
    <FlatList data={PRODUCTS} keyExtractor={i => i.id} contentContainerStyle={s.list}
      ListHeaderComponent={<Text style={s.screenTitle}>Our Soft Baits</Text>}
      renderItem={({ item }) => (
        <View style={s.prodCard}>
          <Text style={s.prodName}>{item.name}</Text>
          <Text style={s.prodDesc}>{item.desc}</Text>
          <View style={s.prodRow}>
            <Text style={s.prodTag}>{item.tag}</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => addToCart(item)}>
              <Text style={s.addBtnText}>{item.price} \u00b7 Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

function CartScreen({ navigation }) {
  const { cart, remove, updateQty, clear, total } = useCart();
  return (
    <ScrollView style={s.screen}>
      <Text style={s.screenTitle}>Your Cart</Text>
      {cart.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>Nothing here yet.</Text>
          <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Baits')}>
            <Text style={s.btnText}>Browse Baits</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {cart.map((item, i) => (
            <View key={i} style={s.cartItem}>
              <View style={{ flex: 1 }}>
                <Text style={s.cartName}>{item.name}</Text>
                <Text style={s.cartTag}>{item.tag}</Text>
              </View>
              <View style={s.cartActions}>
                <View style={s.qtyRow}>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(i, -1)}><Text style={s.qtyBtnText}>-</Text></TouchableOpacity>
                  <Text style={s.qtyNum}>{item.qty}</Text>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(i, 1)}><Text style={s.qtyBtnText}>+</Text></TouchableOpacity>
                </View>
                <Text style={s.cartPrice}>{item.price}</Text>
              </View>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalVal}>{'$'}{total.toFixed(2)} CAD</Text>
          </View>
          <TouchableOpacity style={s.btn}><Text style={s.btnText}>Checkout</Text></TouchableOpacity>
          <TouchableOpacity style={s.clearBtn} onPress={() => Alert.alert('Clear?', 'Remove all?', [{ text: 'No' }, { text: 'Yes', onPress: clear }])}>
            <Text style={s.clearText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  return (
    <ScrollView style={s.screen} keyboardShouldPersistTaps="handled">
      <Text style={s.screenTitle}>Get in Touch</Text>
      <View style={s.contactInfo}>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:info@baitworm.ca')}>
          <Text style={s.contactLink}>info@baitworm.ca</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+16135552248')}>
          <Text style={s.contactLink}>(613) 555-BAIT</Text>
        </TouchableOpacity>
        <Text style={s.contactText}>Kingston, Ontario, Canada K7L</Text>
        <Text style={s.contactText}>Mon\u2013Fri 7AM\u20135PM \u00b7 Sat 7AM\u201312PM</Text>
      </View>
      <TextInput style={s.input} placeholder="Your Name" placeholderTextColor={STONE}
        value={form.name} onChangeText={t => setForm({...form, name: t})} />
      <TextInput style={s.input} placeholder="Your Email" placeholderTextColor={STONE}
        keyboardType="email-address" value={form.email} onChangeText={t => setForm({...form, email: t})} />
      <TextInput style={[s.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Your Message" placeholderTextColor={STONE}
        multiline value={form.msg} onChangeText={t => setForm({...form, msg: t})} />
      <TouchableOpacity style={s.btn} onPress={() => {
        Alert.alert('Sent', 'Thanks! We\u2019ll be in touch.');
        setForm({ name: '', email: '', msg: '' });
      }}><Text style={s.btnText}>Send Message</Text></TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={INK} />
      <View style={s.header}>
        <Text style={s.logo}>Baitworm<Text style={{ color: RUST }}>.</Text></Text>
        <Text style={s.sub}>Kingston, ON</Text>
      </View>
      <Tab.Navigator screenOptions={{
        headerShown: false, tabBarStyle: s.tabBar,
        tabBarActiveTintColor: RUST, tabBarInactiveTintColor: STONE,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
      }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Baits" component={BaitsScreen} options={{ tabBarLabel: 'Soft Baits' }} />
        <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: 'Cart' }} />
        <Tab.Screen name="Contact" component={ContactScreen} options={{ tabBarLabel: 'Contact' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: INK, paddingTop: Platform.OS === 'ios' ? 50 : 35, paddingBottom: 12, paddingHorizontal: 20 },
  logo: { color: WHITE, fontSize: 22, fontWeight: '700' },
  sub: { color: STONE, fontSize: 11, marginTop: 2, letterSpacing: 1 },
  screen: { flex: 1, padding: 20, backgroundColor: CREAM },
  tabBar: { backgroundColor: INK, paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 8, borderTopWidth: 0, height: Platform.OS === 'ios' ? 85 : 60 },
  hero: { backgroundColor: INK, borderRadius: 12, padding: 32, marginBottom: 24 },
  eyebrow: { color: RUST_LIGHT, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  heroTitle: { color: WHITE, fontSize: 28, fontWeight: '700', lineHeight: 34, marginBottom: 14 },
  heroDesc: { color: STONE, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  btn: { backgroundColor: RUST, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 6, alignItems: 'center', marginTop: 12 },
  btnText: { color: WHITE, fontWeight: '600', fontSize: 14 },
  values: { gap: 12 },
  valueCard: { backgroundColor: WHITE, borderRadius: 8, padding: 20, borderWidth: 1, borderColor: SAND },
  valueNum: { color: RUST, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  valueTitle: { color: INK, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  valueDesc: { color: STONE, fontSize: 13 },
  screenTitle: { fontSize: 24, fontWeight: '700', color: INK, textAlign: 'center', marginVertical: 20 },
  list: { padding: 20 },
  prodCard: { backgroundColor: WHITE, borderRadius: 8, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: SAND },
  prodName: { fontSize: 16, fontWeight: '700', color: INK, marginBottom: 4 },
  prodDesc: { fontSize: 13, color: STONE, marginBottom: 12, lineHeight: 19 },
  prodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prodTag: { fontSize: 12, color: STONE, borderWidth: 1, borderColor: SAND, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12 },
  addBtn: { backgroundColor: RUST, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  addBtnText: { color: WHITE, fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: STONE, marginBottom: 16 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 8, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: SAND },
  cartName: { fontSize: 15, fontWeight: '600', color: INK },
  cartTag: { fontSize: 12, color: STONE },
  cartActions: { alignItems: 'flex-end' },
  cartPrice: { fontSize: 15, fontWeight: '700', color: RUST, marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: INK, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  qtyNum: { fontSize: 15, fontWeight: '700', color: INK, marginHorizontal: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderTopWidth: 1, borderTopColor: SAND, marginTop: 8 },
  totalLabel: { fontSize: 16, color: STONE },
  totalVal: { fontSize: 16, fontWeight: '700', color: INK },
  clearBtn: { alignItems: 'center', marginTop: 10, paddingVertical: 8 },
  clearText: { color: STONE, fontSize: 13 },
  contactInfo: { backgroundColor: WHITE, borderRadius: 8, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: SAND },
  contactLink: { color: RUST, fontSize: 14, marginBottom: 8, textDecorationLine: 'underline' },
  contactText: { color: STONE, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: WHITE, borderWidth: 1, borderColor: SAND, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 12, color: INK },
});
