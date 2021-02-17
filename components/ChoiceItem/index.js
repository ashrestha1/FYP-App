import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import styles from './styles';
const ChoiceItem = (props) => {
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
    </View>
  );
};

export default ChoiceItem;
