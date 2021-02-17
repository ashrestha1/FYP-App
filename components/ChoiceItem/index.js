import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import StyledButton from '../StyledButton';
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
      <StyledButton
        type="primary"
        content={'View Models'}
        onPress={() => {
          console.warn('view models pressed');
        }}
      />
      <StyledButton
        type="secondary"
        content={'record a voice'}
        onPress={() => {
          console.warn('record pressed');
        }}
      />
    </View>
  );
};

export default ChoiceItem;
