import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TextInput,
} from 'react-native';
import styles from './styles';
const NameInputScreen = ({ navigation }) => {
  const [name, setName] = React.useState();
  return (
    <View style={styles.choiceContainer}>
      <ImageBackground style={styles.image} />
      <View style={styles.back}>
        <Pressable
          style={[styles.button, { backgroundColor: '#171A20CC' }]}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={[styles.text, { color: '#FFFFFF' }]}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.titles}>
        <Text style={styles.title}>Name of the model</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John Doe"
          onChangeText={(val) => setName(val)}
        ></TextInput>
        <Text>{name}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.container}>
          <Pressable
            style={[styles.button, { backgroundColor: '#FFFFFFA6' }]}
            onPress={() => navigation.navigate('Record', { name })}
          >
            <Text style={[styles.text, { color: '#171A20' }]}>Enter</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default NameInputScreen;
