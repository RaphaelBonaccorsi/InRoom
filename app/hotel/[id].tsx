import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:3000/api';

export default function HotelDetailScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (id) queryParams.append('id', id);

        const url = `${API_BASE_URL}/hoteis?${queryParams.toString()}`;
        const response = await axios.get(url);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setHotel(response.data[0]);
        } else if (response.data && !Array.isArray(response.data)) {
          setHotel(response.data);
        } else {
          setError('Hotel não encontrado.');
        }
      } catch (err) {
        setError('Não foi possível carregar os detalhes do hotel.');
        Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor. Verifique se o backend está rodando e o IP está correto.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error || !hotel) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={50} color="#FF0000" />
        <Text style={styles.errorText}>{error || 'Hotel não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: hotel.nome }} />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{hotel.nome}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={22} color="#FFD700" />
            <Text style={styles.rating}>
              {hotel.avaliacao != null ? parseFloat(hotel.avaliacao).toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
        <Text style={styles.location}>
          <MaterialIcons name="location-on" size={16} color="#007BFF" />
          {hotel.cidade}, {hotel.estado}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.price}>R$ {hotel.preco} <Text style={styles.priceNight}>/ noite</Text></Text>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{hotel.descricao}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    padding: 0,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    margin: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 15,
    color: '#007BFF',
    marginBottom: 10,
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
    borderRadius: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 2,
  },
  priceNight: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'normal',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 4,
    marginTop: 6,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 2,
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginTop: 10,
    textAlign: 'center',
  },
});