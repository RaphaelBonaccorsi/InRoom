import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Importe mais ícones se precisar
// import { useRouter } from 'expo-router'; // Descomente se for usar navegação

// --- Dados Mockados para Simular Reservas ---
// Em um app real, isso viria de uma API
const mockReservations = [
  {
    id: 'res_001',
    hotelName: 'Grand Hotel Excelsior',
    roomType: 'Suíte Luxo',
    checkIn: '20/07/2025',
    checkOut: '25/07/2025',
    guests: 2,
    totalPrice: 'R$ 1.500,00',
    status: 'Confirmada',
    imageUrl: 'https://images.unsplash.com/photo-1542307221-a53b27b919a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'res_002',
    hotelName: 'Pousada Sol e Mar',
    roomType: 'Quarto Duplo',
    checkIn: '10/08/2025',
    checkOut: '12/08/2025',
    guests: 1,
    totalPrice: 'R$ 450,00',
    status: 'Pendente',
    imageUrl: 'https://images.unsplash.com/photo-1517840134011-e63d6b63630f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'res_003',
    hotelName: 'Hotel Central',
    roomType: 'Quarto Padrão',
    checkIn: '05/09/2025',
    checkOut: '07/09/2025',
    guests: 3,
    totalPrice: 'R$ 700,00',
    status: 'Concluída',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function ProfileScreen() {
  // const router = useRouter(); // Descomente se for usar navegação

  const [userName, setUserName] = useState('João da Silva');
  const [userEmail, setUserEmail] = useState('joao.silva@inroom.com');
  const [userPhoto, setUserPhoto] = useState('https://via.placeholder.com/150'); // URL de uma foto de perfil

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            console.log('Usuário deslogado!');
            // Lógica de desautenticação aqui (limpar token, cache, etc.)
            // Ex: router.replace('/login'); // Navegar para a tela de login
          },
          style: "destructive", // Estilo de botão para ação destrutiva
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    console.log('Editar perfil clicado');
    // Aqui você navegaria para uma tela de edição de perfil
    // Ex: router.push('/(tabs)/profile/edit');
  };

  const handleViewReservation = (reservationId: string) => {
    console.log('Ver detalhes da reserva:', reservationId);
    // Aqui você navegaria para uma tela de detalhes da reserva
    // Ex: router.push(`/(tabs)/reservations/${reservationId}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Seção de Cabeçalho do Perfil */}
      <View style={styles.header}>
        <Image source={{ uri: userPhoto }} style={styles.profileImage} />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <MaterialIcons name="edit" size={20} color="#007BFF" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de Informações Adicionais (opcional) */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionHeading}>Informações Pessoais</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="cake" size={20} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Nascimento: 01/01/1990</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={20} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Telefone: (11) 98765-4321</Text>
        </View>
        {/* Adicione mais informações aqui */}
      </View>

      {/* Seção de Minhas Reservas */}
      <View style={styles.reservationsSection}>
        <Text style={styles.sectionHeading}>Minhas Reservas</Text>
        {mockReservations.length > 0 ? (
          mockReservations.map((reservation) => (
            <TouchableOpacity 
              key={reservation.id} 
              style={styles.reservationCard} 
              onPress={() => handleViewReservation(reservation.id)}
            >
              <Image source={{ uri: reservation.imageUrl }} style={styles.reservationImage} />
              <View style={styles.reservationDetails}>
                <Text style={styles.reservationHotelName}>{reservation.hotelName}</Text>
                <Text style={styles.reservationRoomType}>{reservation.roomType}</Text>
                <Text style={styles.reservationDates}>{reservation.checkIn} - {reservation.checkOut}</Text>
                <Text style={styles.reservationPrice}>{reservation.totalPrice}</Text>
                <Text style={[styles.reservationStatus, { color: reservation.status === 'Confirmada' ? 'green' : reservation.status === 'Pendente' ? 'orange' : 'gray' }]}>
                  Status: {reservation.status}
                </Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={18} color="#888" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noReservationsText}>Você ainda não possui reservas.</Text>
        )}
      </View>

      {/* Opções de Conta */}
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.optionItem}>
          <MaterialIcons name="help-outline" size={24} color="#555" />
          <Text style={styles.optionText}>Ajuda e Suporte</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <MaterialIcons name="privacy-tip" size={24} color="#555" />
          <Text style={styles.optionText}>Política de Privacidade</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
          <MaterialIcons name="exit-to-app" size={24} color="#FF6347" />
          <Text style={[styles.optionText, { color: '#FF6347' }]}>Sair da Conta</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Fundo geral do perfil
  },
  contentContainer: {
    paddingVertical: 20, // Padding vertical para o conteúdo rolável
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // Fundo branco para o cabeçalho
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Imagem redonda
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FF', // Fundo azul claro
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
    fontWeight: '500',
  },
  // Seções gerais (Informações, Reservas, Opções)
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  reservationsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  optionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  // Estilos para Informações Pessoais
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  // Estilos para Cards de Reserva
  reservationCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9', // Fundo leve para cada card de reserva
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  reservationImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 15,
  },
  reservationDetails: {
    flex: 1, // Ocupa o espaço restante
  },
  reservationHotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  reservationRoomType: {
    fontSize: 15,
    color: '#666',
    marginBottom: 2,
  },
  reservationDates: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  reservationPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF', // Azul para o preço
    marginTop: 5,
  },
  reservationStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noReservationsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Estilos para Itens de Opções
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    flex: 1, // Ocupa o espaço restante entre ícones
    fontSize: 17,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
});