import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import styles from './styles';
import { TextInput } from 'react-native-paper';
const NameInputScreen = ({ navigation }) => {
  const [name, setName] = React.useState();

  return (
    <View style={styles.choiceContainer}>
      <ImageBackground style={styles.image} />
      <View style={styles.back}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Icon name="chevron-back-sharp" style={{ color: 'black' }} />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.title,
          {
            alignSelf: 'center',
            marginTop: '30%',
            fontSize: 30,
            fontWeight: '500',
          },
        ]}
      >
        Build your Voice
      </Text>
      <View style={styles.titles}>
        <TextInput
          mode={'outlined'}
          selectionColor={'#171A20CC'}
          underlineColor={'#171A20CC'}
          label={'Name of the model'}
          style={styles.input}
          theme={{
            colors: {
              placeholder: '#b2b2b2',
              text: 'black',
              primary: '#b2b2b2',
            },
          }}
          onChangeText={(val) => setName(val)}
          dense={true}
        ></TextInput>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.container}>
          <Pressable
            style={[styles.button, { backgroundColor: '#FFFFFFA6' }]}
            onPress={() => navigation.navigate('Record', { name })}
          >
            <Text style={[styles.text, { color: '#171A20' }]}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default NameInputScreen;
