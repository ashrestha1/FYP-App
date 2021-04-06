import React from 'react';
import { View, Text, ImageBackground, Pressable, Image } from 'react-native';
import styles from './styles';
import MynahIcon from '../../assets/icons/myna.png';
const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.choiceContainer}>
      <ImageBackground style={styles.image} />

      <View style={styles.titles}>
        <Text style={styles.title}>Mynah</Text>
        <Text style={styles.subtitles}>
          An assistive tool for the speech impaired
        </Text>
      </View>

      <View>
        <Image
          source={MynahIcon}
          style={{
            width: 300,
            height: 300,
            alignSelf: 'center',
            marginTop: 15,
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.container}>
          <Pressable
            style={[styles.button, { backgroundColor: '#171A20CC' }]}
            onPress={() => navigation.navigate('Generate')}
          >
            <Text style={[styles.text, { color: '#FFFFFF' }]}>Generate</Text>
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
