import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ListItemProps {
  item: { id: string, title: string };
  onPress: (item: { id: string, title: string }) => void;
  onLongPress: (item: { id: string, title: string }) => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, onPress, onLongPress }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    onLongPress={() => onLongPress(item)}
    style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
    <Text style={{color:'#FFFFFF'}}>{item.title}</Text>
  </TouchableOpacity>
);

const ListScreen: React.FC = () => {
  const [listData, setListData] = useState<{ id: string, title: string }[]>([
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 6' },
    { id: '7', title: 'Item 7' },
    { id: '8', title: 'Item 8' },
    { id: '9', title: 'Item 9' },
    { id: '10', title: 'Item 10' },
    { id: '11', title: 'Item 1' },
    { id: '12', title: 'Item 2' },
    { id: '13', title: 'Item 3' },
    { id: '14', title: 'Item 4' },
    { id: '15', title: 'Item 5' },
    { id: '16', title: 'Item 6' },
    { id: '17', title: 'Item 7' },
    { id: '18', title: 'Item 8' },
    { id: '19', title: 'Item 9' },
    { id: '20', title: 'Item 10' }
  ]);
  const navigation = useNavigation();

  const handleItemPress = (item: { id: string, title: string }) => {
    navigation.navigate('Details', { item });
  };

  const handleItemLongPress = (item: { id: string, title: string }) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const newListData = listData.filter((i) => i.id !== item.id);
          setListData(newListData);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: { id: string, title: string } }) => (
    <ListItem item={item} onPress={handleItemPress} onLongPress={handleItemLongPress} />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={listData} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

export default ListScreen;
