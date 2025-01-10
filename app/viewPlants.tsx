import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const App = () => {
  // Example plant data
  const plants = [
    {id: '1', name: 'Plant 1'},
    {id: '2', name: 'Plant 2'},
    {id: '3', name: 'Plant 3'},
    {id: '4', name: 'Plant 4'},
    {id: '5', name: 'Plant 5'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your garden</Text>
      <FlatList
        data={[...plants, { id: 'add', name: 'Add' }]}
        renderItem={({ item }) =>
          item.id === 'add' ? (
            // Render the "Add" button
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          ) : (
            // Render plant items
            <View style={styles.plantCard}>
              <Text style={styles.plantName}>{item.name}</Text>
            </View>
          )
        }
        keyExtractor={(item) => item.id}
        numColumns={2} // Set number of columns for the grid
        columnWrapperStyle={styles.row} // Styling for each row
        contentContainerStyle={styles.grid} // Padding for the grid
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  plantCard: {
    width: '45%', // Slightly less than 50% to add spacing
    aspectRatio: 1, // Square card
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  addText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default App;
