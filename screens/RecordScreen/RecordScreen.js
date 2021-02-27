import React from 'react';
import { View, Text, Title } from 'react-native';
import { Audio } from 'expo-av';
import RecordClass from './RecordClass';
const RecordScreen = ({ navigation, route }) => {
  const [recording, setRecording] = React.useState();
  const name = route.params.name;

  return (
    <View>
      <RecordClass name={name} />
    </View>
  );
};

export default RecordScreen;
