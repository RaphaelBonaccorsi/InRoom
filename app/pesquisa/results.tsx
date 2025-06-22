import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'; // Importe Axios

const API_BASE_URL = 'http://10.0.0.145:3000/api'; // <--- MUDE PARA O IP DA SUA MÁQUINA E PORTA DA API

export default function SearchResultsScreen() {
  const params = useLocalSearchParams();
  const { city, state, minPrice, maxPrice } = params;

  const [filteredHotels, setFilteredHotels] = useState([]); // Tipo genérico por enquanto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      try {
        const queryParams = new URLSearchParams();
        if (city) queryParams.append('cidade', city as string);
        if (state) queryParams.append('estado', state as string);
        if (minPrice) queryParams.append('minPrice', minPrice as string);
        if (maxPrice) queryParams.append('maxPrice', maxPrice as string);

        const url = `${API_BASE_URL}/hoteis?${queryParams.toString()}`;
        console.log("URL da API:", url); // Para depuração

        const response = await axios.get(url);
        setFilteredHotels(response.data);
      } catch (err) {
        console.error('Erro ao buscar hotéis da API:', err);
        setError('Não foi possível carregar os hotéis. Verifique sua conexão ou tente novamente.');
        Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor. Verifique se o backend está rodando e o IP está correto.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city, state, minPrice, maxPrice]); // Refaz a busca quando os parâmetros mudam

  const renderHotelItem = ({ item }: { item: any }) => ( // Ajuste o tipo 'any' para a interface do seu hotel
    <TouchableOpacity style={styles.hotelCard} onPress={() => console.log('Detalhes do hotel:', item.id)}>
      <Image source={{ uri: item.imagem_url || 'https://via.placeholder.com/150' }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.nome}</Text>
        <Text style={styles.hotelLocation}>{item.cidade}, {item.estado}</Text>
        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.hotelRating}>{item.avaliacao != null ? parseFloat(item.avaliacao).toFixed(1) : 'N/A'}</Text>
          </View>
          <Text style={styles.hotelPrice}>R$ {item.preco || '0.00'} / noite</Text>
        </View>
        <Text style={styles.hotelDescription} numberOfLines={2}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Resultados da Pesquisa' }} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Buscando hotéis...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={50} color="#FF0000" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredHotels.length > 0 ? (
        <FlatList
          data={filteredHotels}
          keyExtractor={(item) => item.id.toString()} // keyExtractor deve ser string
          renderItem={renderHotelItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
              <Text style={styles.resultsHeader}>
                  {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel encontrado' : 'hotéis encontrados'}
                  {(city || state) && ` para ${city ? city : ''}${city && state ? ', ' : ''}${state ? state : ''}`}
              </Text>
          )}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="sentiment-dissatisfied" size={50} color="#888" />
          <Text style={styles.noResultsText}>Nenhum hotel encontrado para sua pesquisa.</Text>
          <Text style={styles.noResultsSubText}>Tente ajustar seus filtros.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  listContent: {
    padding: 15,
  },
  resultsHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15,
      textAlign: 'center',
  },
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
  hotelImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsSubText: {
    fontSize: 15,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFE0E0', // Fundo vermelho claro para erro
    margin: 20,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginTop: 10,
    textAlign: 'center',
  },
});
