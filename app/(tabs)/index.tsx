import { ScrollView, View, Text } from 'react-native';
import HotelRoomCard from '../(rooms)/hotelRoomCard';

export default function HomePage() {
  return (
    <ScrollView>
      <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 16 }}>Melhores quartos</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
      </ScrollView>

      <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 16 }}>Promoções</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
        <HotelRoomCard />
      </ScrollView>
    </ScrollView>
  );
}
