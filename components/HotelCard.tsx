import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface HotelCardProps {
  item: {
    id: number;
    nome: string;
    cidade: string;
    estado: string;
    preco: number | string;
    descricao: string;
    avaliacao: number | string | null;
    imagem_url?: string;
  };
  onPress?: (id: number) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.hotelCard} onPress={() => onPress && onPress(item.id)}>
    <View style={styles.hotelInfo}>
      <Text style={styles.hotelName}>{item.nome}</Text>
      <Text style={styles.hotelLocation}>{item.cidade}, {item.estado}</Text>
      <View style={styles.ratingPriceContainer}>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.hotelRating}>
            {item.avaliacao != null ? parseFloat(item.avaliacao as string).toFixed(1) : 'N/A'}
          </Text>
        </View>
        {/* CORREÇÃO AQUI: Garante que o preço seja formatado com toFixed(2) */}
        <Text style={styles.hotelPrice}>
          R$ {typeof item.preco === 'number' ? item.preco.toFixed(2) : parseFloat(item.preco as string).toFixed(2)} / noite
        </Text>
      </View>
      <Text style={styles.hotelDescription} numberOfLines={2}>{item.descricao}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  hotelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hotelInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotelRating: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 5,
  },
  hotelPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  hotelDescription: {
    fontSize: 13,
    color: '#555',
    marginTop: 5,
  },
});

export default HotelCard;
