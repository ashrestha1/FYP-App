import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
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
import { Directions } from 'react-native-gesture-handler';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

const GenerateScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const cameraRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [textModalIsVisible, setTextModalIsVisible] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState(100);
  const [textBlurIntensity, setTextBlurIntensity] = useState(0);
  const [textEntered, setTextEntered] = useState(null);
  const [isHidden, setIsHidden] = React.useState('flex');

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

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        console.log('picture source', source);
      }
    }
  };

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();

        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log('video source', source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };
  const sendTextButtonPushed = () => {
    console.log('hi');
    navigation.navigate('Main');
  };
  const cancelTextEnter = () => {
    setTextModalIsVisible(false);
    setTextBlurIntensity(0);
    setIsHidden('flex');
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
  };

  const renderCancelPreviewButton = () => (
    <TouchableOpacity
      onPress={cancelPreview}
      style={[styles.closeButton, { display: isHidden }]}
    >
      <Icon name="close" style={{ color: 'white' }} />
    </TouchableOpacity>
  );

  const renderConfirmPreviewButton = () => (
    <View style={styles.openButtonContainer}>
      <TouchableOpacity
        onPress={renderTextEnterModal}
        style={[styles.openButton, { display: isHidden }]}
      >
        <Text style={styles.confirmText}>Send</Text>
        <Icon
          name="send"
          style={{
            color: 'black',
            fontSize: 20,
            alignSelf: 'center',
            marginTop: 2,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const renderTextEnterModal = () => {
    setTextModalIsVisible(true);
    setTextBlurIntensity(100);
    setIsHidden('none');
  };

  const renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );

  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{'Recording...'}</Text>
    </View>
  );

  const renderCaptureControl = () => (
    <View>
      <Header
        rounded
        style={{
          alignItems: 'flex-end',
          backgroundColor: 'transparent',
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
      <View style={styles.control}>
        <MaterialCommunityIcons
          name="image-multiple"
          style={{ color: 'white', fontSize: 36 }}
        />
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onLongPress={recordVideo}
            onPressOut={stopVideoRecording}
            onPress={takePicture}
          >
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
          disabled={!isCameraReady}
          onPress={switchCamera}
        >
          <MaterialCommunityIcons
            name="twitter-retweet"
            style={{ color: 'white', fontWeight: 'bold', fontSize: 36 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        flashMode={Camera.Constants.FlashMode.on}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          console.log('cammera error', error);
        }}
      />
      <BlurView
        intensity={blurIntensity}
        style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
      >
        <Modal animationType={'slide'} transparent={true} visible={isVisible}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>List of Models available</Text>
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

      <BlurView
        intensity={textBlurIntensity}
        style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
      >
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={textModalIsVisible}
        >
          <View style={styles.TextModal}>
            <TouchableOpacity
              onPress={cancelTextEnter}
              style={styles.closeButton}
            >
              <Icon name="close" style={{ color: 'black' }} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter your text:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Hello World"
              onChangeText={(val) => setTextEntered(val)}
            ></TextInput>

            <TouchableOpacity
              style={styles.sendTextButton}
              onPress={sendTextButtonPushed}
            >
              <Text style={styles.sendTextTitle}>Send</Text>
              <Icon
                name="send"
                style={{
                  color: 'white',
                  fontSize: 20,
                  alignSelf: 'center',
                  marginTop: 2,
                }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </BlurView>
      <View style={styles.container}>
        {isVideoRecording && renderVideoRecordIndicator()}
        {videoSource && renderVideoPlayer()}
        {isPreview && renderCancelPreviewButton()}
        {isPreview && renderConfirmPreviewButton()}
        {!videoSource && !isPreview && renderCaptureControl()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  modelName: {
    fontSize: 13,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
    alignItems: 'center',
  },
  input: {
    alignSelf: 'center',
    borderBottomWidth: 0.3,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    marginTop: '5%',
    width: '100%',
    alignContent: 'center',
  },

  nonBlurredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendTextButton: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'black',
    borderRadius: 70,
    marginBottom: 10,
  },
  sendTextTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    padding: 5,
    color: 'white',
  },
  TextModal: {
    flex: 1,
    margin: 200,
    width: 350,
    backgroundColor: 'white',
    padding: 25,
    justifyContent: 'center',

    alignSelf: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modal: {
    flex: 1,
    margin: 220,
    width: 350,
    backgroundColor: 'white',
    padding: 35,
    justifyContent: 'center',

    alignSelf: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    textAlign: 'center',

    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButtonContainer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  openButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '700',
    padding: 5,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: '68%',
    height: 1,
    backgroundColor: 'black',
  },
  control: {
    paddingHorizontal: 10,
    bottom: '-120%',

    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  capture: {
    backgroundColor: '#f5f6f5',
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: '#ff0000',
    marginHorizontal: 5,
  },
  text: {
    color: '#fff',
  },
});

export default GenerateScreen;