// app/(rooms)/hotelRoomCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Lista de imagens com require estático
const roomImages = [
  require('../assets/images/hotel-rooms/1.jpg'),
  require('../assets/images/hotel-rooms/2.jpg'),
  require('../assets/images/hotel-rooms/3.jpg'),
  require('../assets/images/hotel-rooms/4.jpg'),
  require('../assets/images/hotel-rooms/5.jpg'),
  require('../assets/images/hotel-rooms/6.jpg'),
  require('../assets/images/hotel-rooms/7.jpg'),
];

export default function HotelRoomCard() {
  const [image] = useState(() => {
    const randomIndex = Math.floor(Math.random() * roomImages.length);
    return roomImages[randomIndex];
  });

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>Quarto Padrão</Text>
        <Text style={styles.price}>R$ 320,00 / noite</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '40%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginVertical: 10,
    margin: 10,
  },
  image: {
    width: '100%',
    height: 280,
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11324e',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    color: '#555',
  },
});
