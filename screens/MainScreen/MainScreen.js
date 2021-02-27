import React from 'react';
import { View, Text, ImageBackground, Pressable } from 'react-native';
import styles from './styles';
const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.choiceContainer}>
      <ImageBackground
        source={require('../../assets/images/ModelX.jpeg')}
        style={styles.image}
      />

      <View style={styles.titles}>
        <Text style={styles.title}>Head Model</Text>
        <Text style={styles.subtitles}>Choose a model or train a new one</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.container}>
          <Pressable
            style={[styles.button, { backgroundColor: '#171A20CC' }]}
            onPress={() => navigation.navigate('Record')}
          >
            <Text style={[styles.text, { color: '#FFFFFF' }]}>View Models</Text>
          </Pressable>
        </View>
        <View style={styles.container}>
          <Pressable
            style={[styles.button, { backgroundColor: '#FFFFFFA6' }]}
            onPress={() => navigation.navigate('NameInput')}
          >
            <Text style={[styles.text, { color: '#171A20' }]}>Record</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default MainScreen;
