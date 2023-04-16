import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


type Product = {
    id: string;
    name: string;
    icon: string;
    functions: Array<string>;
    status: Array<string>;
    date: Date;
};

const Details: React.FC<{ product: Product }> = ({ product }) => {
  const [displayedProduct, setDisplayedProduct] = useState(product);

  const handleOperationClick = async (operation: string) => {
    try {
      const response = await fetch(`http://localhost:3000/devices/${displayedProduct.id}/operate`, {
        method: 'POST',
        body: JSON.stringify({ operation }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      const updatedProduct = {
        id: data._id.$oid,
        name: data.description,
        icon: 'gear',
        functions: JSON.parse(data.function_list),
        status: data.status,
        date: data.date,
      };

      setDisplayedProduct(updatedProduct);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!displayedProduct) {
    return (
      <View style={styles.container}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{displayedProduct.name}</Text>
      <View style={styles.operationsContainer}>
        {Object.entries(displayedProduct.status).map(([property, value]) =>
            <Text style={styles.operationText}>{property}: {String(value)}</Text>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        {displayedProduct.functions.map((operation, index) => (
          <TouchableOpacity
            key={index}
            style={styles.operationButton}
            onPress={() => handleOperationClick(operation)}
          >
            <Text style={styles.operationText}>{operation}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonsContainer: {
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
  },
  operationsContainer: {
    display: 'flex',
    gap: 50,
    flexDirection: 'column',
    marginBottom: 50,
  },
  operationButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  operationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Details;
