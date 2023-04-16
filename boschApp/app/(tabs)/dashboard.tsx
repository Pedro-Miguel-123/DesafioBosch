import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native';
import { FAB, List, Portal, Provider, IconButton } from 'react-native-paper';
import { black, white } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
import Details from '../details';

type Product = {
  id: string;
  name: string;
  icon: string;
  functions: Array<string>;
  status: Object;
  date: Date;
};

const ProductsListScreen = () => {
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  useEffect(() => {
    document.title = "My Bosch";
  });

  const fetchProducts = async (setProducts) => {
    try {
        const response = await fetch(`http://localhost:3000/devices?user_id=${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        console.log(data);

        let products = data.map((obj) => {
          return {
            id: obj._id.$oid,
            name: obj.description,
            icon: 'gear',
            functions: JSON.parse(obj.function_list),
            status: obj.status,
            date: obj.date,
          }
        })

        setProducts(products);
      } catch (error) {
        console.error(error);
      }
}

  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  const handleDeleteProduct = (productId: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  };

  const handlePress = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: `Product ${products.length + 1}`,
      icon: 'star',
    };

    setProducts((currentProducts) => [...currentProducts, newProduct]);
  };

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/devices/${inputValue}`, {
        method: 'PATCH',
        body: JSON.stringify({ device: { user_id: user.id} }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();

      const newProduct = {
        id: data._id.$oid,
        name: data.description,
        icon: 'gear',
        functions: JSON.parse(data.function_list),
        status: data.status,
        date: data.date,
      };

      setProducts((prevState) => [
        ...prevState,
        newProduct,
      ]);

      setVisible(false);
      

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Provider>
      {!!activeProduct && (
        <IconButton
          icon="arrow-left"
          // color="white"
          size={24}
          onPress={() => setActiveProduct(null)}
        />
      )}
      <View style={styles.container}>
        {activeProduct ? (
          <Details product={activeProduct} />
        ) : (
          <>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={styles.listContainer}>
            <List.Section style={styles.list}>
              {products && products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => setActiveProduct(product)}
                  onLongPress={() => handleDeleteProduct(product.id)}
                >
                  <List.Item
                    title={product.name}
                    left={() => <List.Icon icon={product.icon} />}
                  />
                </TouchableOpacity>
              ))}
            </List.Section>
            <FAB
              style={styles.fab}
              icon="plus"
              onPress={handlePress}
            />
            <Portal>
              {visible && (
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                  <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                      <View style={styles.popup} >
                        <Text>Enter some text:</Text>
                        <TouchableWithoutFeedback>
                          <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                          />
                        </TouchableWithoutFeedback>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                          <Text style={styles.button_text}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </Portal>
          </View>
        </>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  userDetails: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '33%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginVertical: 16,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  button_text: {
    color: 'white'
  }
});

export default ProductsListScreen;
