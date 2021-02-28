import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Camera } from 'expo-camera';
import {
  Container,
  Content,
  Header,
  Item,
  Icon,
  Input,
  Button,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

import styles from './styles';

const GenerateScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [recording, setRecording] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [blurIntensity, setBlurIntensity] = useState(100);
  const [models, setModels] = useState([
    { title: 'Aayush Shrestha', NumOfSteps: 1000 },
    { title: 'Umakant Bhatt', NumOfSteps: 1200 },
    { title: 'Tony Robotics', NumOfSteps: 1300 },
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <BlurView
          intensity={blurIntensity}
          style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
        >
          <Modal animationType={'slide'} transparent={true} visible={isVisible}>
            <View style={styles.modal}>
              <FlatList
                data={models}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsVisible(!isVisible);
                          setBlurIntensity(0);
                        }}
                      >
                        <Text style={styles.modelName}>{item.title}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </Modal>
        </BlurView>
        <Header
          rounded
          style={{
            alignItems: 'flex-end',
            position: 'absolute',
            backgroundColor: 'transparent',
            left: 0,
            top: 0,
            right: 0,
            zIndex: 100,
            borderBottomWidth: 0,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flex: 0.9,
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Main')}>
              <Icon name="chevron-back-sharp" style={{ color: 'white' }} />
            </TouchableOpacity>

            <MaterialCommunityIcons
              name="face-recognition"
              style={{
                color: 'white',
                fontSize: 30,
              }}
            />

            <View>
              <TouchableOpacity style={styles.button}>
                <MaterialCommunityIcons
                  name="flash"
                  style={{
                    color: 'white',
                    fontSize: 30,
                    fontWeight: 'bold',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Header>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginBottom: 15,
            alignItems: 'flex-end',
          }}
        >
          <MaterialCommunityIcons
            name="image-multiple"
            style={{ color: 'white', fontSize: 36 }}
          />
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={() => takePicture()}>
              <MaterialCommunityIcons
                name="circle-outline"
                style={{ color: 'white', fontSize: 100 }}
              ></MaterialCommunityIcons>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="pan-horizontal"
              style={{ color: 'white', fontSize: 36 }}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <MaterialCommunityIcons
              name="twitter-retweet"
              style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}
            />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default GenerateScreen;
