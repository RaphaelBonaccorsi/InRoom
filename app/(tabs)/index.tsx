import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking, TextInput } from 'react-native'; // Importe StyleSheet
import HotelRoomCard from '../(rooms)/hotelRoomCard';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();
  const handleApplyNow = () => {
    console.log('Botão "Candidate-se Agora" clicado!');
    Linking.openURL('https://github.com/DiogoGMelo/InRoom');
  };

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

   const handleSearch = () => {
    console.log('Tentando navegar com:', { city, state, minPrice, maxPrice });
    router.push({
      pathname: '/pesquisa/results',
      params: { city, state, minPrice, maxPrice },
    });
  };
  return (
    // Adicione o contentContainerStyle aqui para o ScrollView principal
    <ScrollView contentContainerStyle={styles.mainScrollViewContent}>
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>Encontre seu hotel ideal</Text>

        {/* Campo de Cidade */}
        <TextInput
          style={styles.searchInput}
          placeholder="Cidade"
          placeholderTextColor="#888"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
        />

        {/* Campo de Estado */}
        <TextInput
          style={styles.searchInput}
          placeholder="Estado (Ex: SP)"
          placeholderTextColor="#888"
          value={state}
          onChangeText={setState}
          autoCapitalize="characters"
          maxLength={2} // Estado geralmente tem 2 letras
        />

        {/* Faixa de Preço */}
        <View style={styles.priceRangeContainer}>
          <TextInput
            style={[styles.searchInput, styles.priceInput]}
            placeholder="Preço Mín."
            placeholderTextColor="#888"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric" // Apenas números
          />
          <Text style={styles.priceSeparator}>até</Text>
          <TextInput
            style={[styles.searchInput, styles.priceInput]}
            placeholder="Preço Máx."
            placeholderTextColor="#888"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric" // Apenas números
          />
        </View>

        {/* Botão de Pesquisa */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Pesquisar Hotéis</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Melhores quartos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScrollView}>
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
      </ScrollView>

      <Text style={styles.sectionTitle}>Promoções</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScrollView}>
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
      </ScrollView>

      
      <Text style={styles.sectionTitle}>Outras Ofertas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScrollView}>
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
      </ScrollView>

      <Text style={styles.sectionTitle}>Venha Fazer Parte do InRoom</Text>
       <View style={styles.callToActionContainer}>
        <Text style={styles.callToActionTitle}>Venha Fazer Parte do InRoom!</Text>
        <Text style={styles.callToActionText}>
          Estamos crescendo e buscamos talentos para inovar conosco.
          Se você ama tecnologia e hospitalidade, seu lugar é aqui!
        </Text>
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={handleApplyNow} // Chama a função definida acima
        >
          <Text style={styles.applyButtonText}>Candidate-se Agora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScrollViewContent: {
    flexGrow: 1, 
    paddingVertical: 16,
    backgroundColor: '#FFFFFF', 
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16, 
    marginBottom: 10,
    marginTop: 10,
  },
  horizontalScrollView: {
    paddingLeft: 16, 
    marginBottom: 20, 
  },
  callToActionContainer: {
    backgroundColor: '#4682B4', 
    marginHorizontal: 16,     
    borderRadius: 12,         
    padding: 20,              
    alignItems: 'center',     
    justifyContent: 'center', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,            
    marginTop: 20,           
    marginBottom: 20,         
  },
  callToActionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    textAlign: 'center',
    marginBottom: 10,
  },
  callToActionText: {
    fontSize: 16,
    color: '#E0E0E0', 
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22, 
  },
  applyButton: {
    backgroundColor: '#28A745', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, 
    marginTop: 10,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchSection: {
    backgroundColor: '#FFFFFF', // Fundo branco para a caixa de pesquisa
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20, // Espaçamento abaixo da seção de pesquisa
    marginTop: 5, // Pequena margem do topo
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  priceRangeContainer: {
    flexDirection: 'row', // Organiza os inputs lado a lado
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceInput: {
    flex: 1, // Ocupa o espaço disponível
    marginRight: 10, // Espaçamento entre os inputs de preço
  },
  priceSeparator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 5,
  },
  searchButton: {
    backgroundColor: '#4682B4', // Azul vibrante para o botão
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
