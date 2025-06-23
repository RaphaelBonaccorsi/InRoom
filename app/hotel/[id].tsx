// app/hotel/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, Image, TouchableOpacity } from 'react-native'; // Adicionado Image e TouchableOpacity
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

interface Hotel {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  preco: number | string;
  descricao: string;
  avaliacao: number | string | null;
  imagem_url?: string; 
}

const API_BASE_URL = 'http://10.0.0.145:3000/api'; // Verifique se este IP e porta estão corretos para seu backend

export default function HotelDetailScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string; // O ID virá como string da URL
  const [hotel, setHotel] = useState<Hotel | null>(null); // Tipagem mais específica
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        // Para buscar um hotel por ID, o ideal é ter um endpoint como /hoteis/:id no backend
        // Seu código atual em [id].tsx está chamando /hoteis?id=...
        // Vou manter a chamada atual, mas um endpoint /hoteis/:id é mais limpo.
        // Se seu backend tem `/api/hoteis/:id`, mude a URL para `${API_BASE_URL}/hoteis/${id}`
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
        console.error("Erro ao carregar detalhes do hotel:", err);
        setError('Não foi possível carregar os detalhes do hotel.');
        Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor. Verifique se o backend está rodando e o IP está correto.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHotel();
  }, [id]);

  const handleReserve = () => {
    if (hotel) {
      // Simulação de reserva
      Alert.alert(
        "Confirmação de Reserva",
        `Deseja reservar ${hotel.nome} por R$ ${typeof hotel.preco === 'number' ? hotel.preco.toFixed(2) : parseFloat(hotel.preco as string).toFixed(2)} / noite?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Confirmar", onPress: () => Alert.alert("Reserva Confirmada!", `Sua reserva no ${hotel.nome} foi realizada com sucesso!`) }
        ]
      );
    }
  };

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

  // Tratamento para garantir que avaliacao e preco são numéricos para toFixed
  const displayRating = hotel.avaliacao != null ? parseFloat(hotel.avaliacao as string).toFixed(1) : 'N/A';
  const displayPrice = typeof hotel.preco === 'number' ? hotel.preco.toFixed(2) : parseFloat(hotel.preco as string).toFixed(2);


  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: hotel.nome }} />

      {/* Imagem de capa do hotel */}
      {hotel.imagem_url ? (
        <Image source={{ uri: hotel.imagem_url }} style={styles.hotelImage} />
      ) : (
        <View style={styles.noImageIcon}>
          <MaterialIcons name="broken-image" size={80} color="#CCC" />
          <Text style={styles.noImageText}>Imagem não disponível</Text>
        </View>
      )}

      <View style={styles.contentCard}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{hotel.nome}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{displayRating}</Text>
          </View>
        </View>

        <Text style={styles.location}>
          <MaterialIcons name="location-on" size={16} color="#555" /> {hotel.cidade}, {hotel.estado}
        </Text>

        <View style={styles.priceContainer}>
            <Text style={styles.price}>R$ {displayPrice} <Text style={styles.priceNight}>/ noite</Text></Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Descrição do Hotel</Text>
        <Text style={styles.description}>{hotel.descricao}</Text>

        <View style={styles.divider} />

        {/* Botão de Reserva */}
        <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
          <Text style={styles.reserveButtonText}>Fazer Reserva</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Cor de fundo suave
  },
  hotelImage: {
    width: '100%',
    height: 250, // Altura da imagem de capa
    resizeMode: 'cover',
    marginBottom: 20,
  },
  noImageIcon: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noImageText: {
    marginTop: 10,
    color: '#888',
    fontSize: 16,
  },
  contentCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 20,
    marginTop: -80, // Subir o card sobre a imagem para um efeito visual
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Permite que o texto quebre linha se for muito longo
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratingText: {
    fontSize: 18,
    color: '#FFD700',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end', // Alinha o preço à direita
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF', // Azul vibrante para o preço
  },
  priceNight: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: '#28a745', // Cor verde para o botão de reserva
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
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
