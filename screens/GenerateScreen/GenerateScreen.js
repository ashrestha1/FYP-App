import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';

import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import Axios from 'axios';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { Header, Icon, Row } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

const GenerateScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [videoAayush, setVideoAayush] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const cameraRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [textModalIsVisible, setTextModalIsVisible] = useState(false);
  const [textModalCancelButton, setTextModalCancelButton] = useState(false);
  const [videoIsPaused, setVideoIsPaused] = useState(true);
  const [blurIntensity, setBlurIntensity] = useState(100);
  const [textBlurIntensity, setTextBlurIntensity] = useState(0);
  const [imageSource, setImageSource] = useState(null);
  const [textEntered, setTextEntered] = useState(null);
  const [isHiddenConfirm, setIsHiddenConfirm] = React.useState('flex');
  const [isHiddenCancel, setIsHiddenCancel] = React.useState('flex');
  const [loadingTakePic, setLoadingTakePic] = useState(false);
  const [loadingSendPic, setLoadingSendPic] = useState(false);
  const [videoEvaluation, setVideoEvaluation] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [status, setStatus] = React.useState({});
  const [audioChecked, setAudioChecked] = useState(false);
  const [videoChecked, setVideoChecked] = useState(false);
  const videoOutput = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    getModels();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      setImageSource(source);
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
      }
    }
  };

  const pickImage = async () => {
    cameraRef.current.ta;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const source = result.uri;
      setImageSource(source);
      setIsCameraOn(false);
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
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };
  const getModels = () => {
    return Axios.get('http://35.229.251.43/listVoiceModels')
      .then((response) => {
        setModels(response.data);
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  const sendTextButtonPushed = () => {
    postText();
    setIsHiddenConfirm('none');
    setLoadingSendPic(true);
  };
  const cancelTextEnter = () => {
    setTextModalIsVisible(false);
    setTextModalCancelButton(false);
    setTextBlurIntensity(0);
    setIsHiddenConfirm('flex');
    setIsHiddenCancel('flex');
  };

  const replayVideo = async () => {
    if (videoOutput.current) {
      await videoOutput.current.replayAsync();
    }
  };
  const playOrPauseVideo = async () => {
    if (videoOutput.current) {
      console.log(status.durationMillis - status.positionMillis);

      if (status.durationMillis - status.positionMillis == 0) {
        await videoOutput.current.setPositionAsync(0);
      }
      status.isPlaying
        ? await videoOutput.current.pauseAsync()
        : await videoOutput.current.playAsync();
    }
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
    setIsHiddenConfirm('flex');
    setVideoAayush(false);
    {
      isCameraOn && (await cameraRef.current.resumePreview());
    }
    setIsCameraOn(true);
    setIsPreview(false);
    setVideoSource(null);
  };

  const renderCancelPreviewButton = () => (
    <TouchableOpacity
      onPress={cancelPreview}
      style={[styles.closeButton, { display: isHiddenCancel }]}
    >
      <Icon name="close" style={{ color: 'white' }} />
    </TouchableOpacity>
  );

  const uploadImage = (Img) => {
    console.log('upload image');
    //   const manipResult = await ImageManipulator.manipulate(
    //     img,
    //     [{ resize: { width: 250, height: 250 } }],
    //     { format: 'jpg' }
    // );

    // setImageSource(manipResult);

    const data = new FormData();
    let filename = Img.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    data.append('file', {
      uri: Img,
      name: 'aayush-10.jpg',
      type,
    });
    // data.append('filename', 'aayush-10.jpg');

    // return Axios.post('http://35.229.251.43/upload-pic', data, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // }).then((response) => {
    //   console.log('hi', response.data);
    //   console.log('bye', response);
    //   return response.data;
    // });

    // fetch('http://35.229.251.43/upload-pic', {
    //   method: 'POST',
    //   body: data,
    // }).then((response) => {
    //   console.log(response);
    // });
    return Axios.post('http://35.229.251.43/upload-pic', data)
      .catch((error) => console.log('error:', error))
      .then((res) => {
        console.log(res);
        setLoadingTakePic(false);
        setTextModalIsVisible(true);
        setTextModalCancelButton(true);
        setIsHiddenConfirm('none');
        setIsHiddenCancel('none');
        return res;
      });
  };

  const postText = () => {
    console.log('post text');
    console.log('text', textEntered);
    setVideoEvaluation('');
    const data = new FormData();
    data.append('model', selectedModel.item);
    data.append('text', textEntered);

    // fetch('http://35.229.251.43/evaluate', {
    //   method: 'POST',
    //   body: data,
    // })
    //   .then((response) => {
    //     setVideoEvaluation(
    //       'https://desmondbucket.s3-ap-southeast-1.amazonaws.com/mykey.mp4'
    //     );
    //   })
    //   .then(() => {
    //     console.log('replay');
    //     videoOutput.current.replayAsync();
    //   });

    return Axios.post('http://35.229.251.43/evaluate', data)
      .catch((error) => console.log('error:', error))
      .then((res) => {
        setLoadingSendPic(false);
        setVideoAayush(true);
        console.log('res', res);
        console.log(selectedModel.item);
        setVideoEvaluation(
          'https://fyp2021.s3-ap-northeast-1.amazonaws.com/mykey.mp4'
        );

        return res;
      });
  };

  const renderConfirmPreviewButton = () => (
    <View style={styles.openButtonContainer}>
      <TouchableOpacity
        onPress={renderTextEnterModal}
        style={[styles.openButton, { display: isHiddenConfirm }]}
      >
        <Icon
          name="checkmark-circle-outline"
          style={{
            color: 'white',
            fontSize: 100,
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const renderProgressBar = () => (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',

        alignSelf: 'center',
      }}
    >
      <Progress.Bar
        indeterminate={true}
        indeterminateAnimationDuration={3000}
        width={300}
        color={'#00BFFF'}
        borderColor={'rgba(255, 255, 255, 0.1)'}
        height={10}
        borderRadius={10}
      />
    </View>
  );

  const renderCircleProgressForConfirm = () => (
    <View
      style={[styles.openButtonContainer, { marginLeft: 0, marginBottom: 4 }]}
    >
      <AnimatedCircularProgress
        style={styles.openButton}
        size={100}
        width={10}
        fill={100}
        duration={5000}
        tintColor="#00BFFF"
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875"
      />
    </View>
  );

  const renderTextEnterModal = () => {
    setLoadingTakePic(true);
    console.log('uploadactivate');
    uploadImage(imageSource);
  };

  const renderVideoAayush = () => (
    <Video
      source={{
        uri: videoEvaluation,
      }}
      ref={videoOutput}
      onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      style={[
        styles.media,
        {
          backgroundColor: 'black',

          alignSelf: 'center',
          alignContent: 'center',
          alignItems: 'center',
          height: '150%',
          marginTop: -200,
        },
      ]}
    />
  );
  const renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );

  const renderCamera = () => (
    <Camera
      ref={cameraRef}
      style={[
        {
          aspectRatio: 1,
          bottom: '9%',
        },
      ]}
      ratio={'1:1'}
      type={cameraType}
      flashMode={Camera.Constants.FlashMode.on}
      onCameraReady={onCameraReady}
      onMountError={(error) => {
        console.log('cammera error', error);
      }}
    />
  );

  const renderImagePicker = () => (
    <Image
      style={[
        {
          aspectRatio: 1,
          bottom: '9%',
        },
      ]}
      source={{ uri: imageSource }}
    />
  );

  const renderSelectModal = () => (
    <BlurView
      intensity={blurIntensity}
      style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
    >
      <Modal animationType={'slide'} transparent={true}>
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
                      setSelectedModel({ item });
                    }}
                  >
                    <Text style={styles.modelName}>{item}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                audioChecked ? setAudioChecked(false) : setAudioChecked(true);
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                <Text style={{ alignSelf: 'center' }}>Audio Only</Text>
                <MaterialCommunityIcons
                  name={
                    audioChecked
                      ? 'checkbox-marked-circle-outline'
                      : 'checkbox-blank-circle-outline'
                  }
                  style={{
                    color: 'black',
                    fontSize: 30,
                    alignSelf: 'center',
                    marginLeft: 10,
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                videoChecked ? setVideoChecked(false) : setVideoChecked(true);
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                <Text style={{ alignSelf: 'center' }}>Video</Text>
                <MaterialCommunityIcons
                  name={
                    videoChecked
                      ? 'checkbox-marked-circle-outline'
                      : 'checkbox-blank-circle-outline'
                  }
                  style={{
                    color: 'black',
                    fontSize: 30,
                    alignSelf: 'center',
                    marginLeft: 10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </BlurView>
  );

  const renderTextModal = () => (
    <BlurView
      intensity={0}
      style={[
        StyleSheet.absoluteFill,
        styles.nonBlurredContent,
        { borderRadius: 20 },
      ]}
    >
      <Modal animationType={'slide'} transparent={true}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            {renderSendTextButton()}
            {renderCancelTextButton()}
            {videoAayush && renderReplayButton()}
            {videoAayush && downloadButton()}
            {videoAayush && renderPlayOrPauseButton()}
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          behavior="height"
          style={[
            {
              flex: 1,
              marginBottom: 70,
            },
          ]}
        >
          <View style={[styles.TextModal]}>
            <BlurView intensity={90} style={[StyleSheet.absoluteFill]}>
              <TextInput
                style={styles.input}
                multiline={true}
                returnKeyType="done"
                blurOnSubmit={true}
                placeholder="e.g. Hello World"
                onChangeText={(val) => setTextEntered(val)}
              ></TextInput>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </BlurView>
  );

  const renderSendTextButton = () => (
    <TouchableOpacity
      style={styles.sendTextButton}
      onPress={sendTextButtonPushed}
    >
      <Icon
        name="send"
        style={{
          color: 'white',
          fontSize: 20,
          alignSelf: 'center',
        }}
      />
    </TouchableOpacity>
  );

  const renderCancelTextButton = () => (
    <TouchableOpacity onPress={cancelTextEnter} style={styles.closeTextButton}>
      <Icon
        name="close-circle-outline"
        style={{ color: 'white', fontSize: 30, alignSelf: 'center' }}
      />
    </TouchableOpacity>
  );

  const renderReplayButton = () => (
    <TouchableOpacity onPress={replayVideo} style={styles.replayButton}>
      <MaterialCommunityIcons
        name="replay"
        style={{ color: 'white', fontSize: 30, alignSelf: 'center' }}
      />
    </TouchableOpacity>
  );

  const renderPlayOrPauseButton = () => (
    <TouchableOpacity
      onPress={playOrPauseVideo}
      style={styles.playOrPauseButton}
    >
      <Icon
        name={status.isPlaying ? 'pause' : 'play'}
        style={{ color: 'white', fontSize: 30, alignSelf: 'center' }}
      />
    </TouchableOpacity>
  );

  const downloadButton = () => (
    <TouchableOpacity style={styles.downloadButton}>
      <MaterialCommunityIcons
        name="download"
        style={{ color: 'white', fontSize: 30, alignSelf: 'center' }}
      />
    </TouchableOpacity>
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
            <TouchableOpacity>
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
        <TouchableOpacity onPress={pickImage}>
          <MaterialCommunityIcons
            name="image-multiple"
            style={{ color: 'white', fontSize: 36 }}
          />
        </TouchableOpacity>

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
    <SafeAreaView
      style={[
        styles.container,
        { justifyContent: 'space-evenly', backgroundColor: 'black' },
      ]}
    >
      {isCameraOn && renderCamera()}
      {!isCameraOn && renderImagePicker()}

      <View style={styles.container}>
        {isVideoRecording && renderVideoRecordIndicator()}
        {videoSource && renderVideoPlayer()}
        {videoAayush && renderVideoAayush()}
        {(isPreview || !isCameraOn) && renderCancelPreviewButton()}
        {(isPreview || !isCameraOn) && renderConfirmPreviewButton()}
        {loadingTakePic && renderCircleProgressForConfirm()}
        {loadingSendPic && renderProgressBar()}
        {!videoSource && !isPreview && isCameraOn && renderCaptureControl()}
        {isVisible && renderSelectModal()}
        {textModalIsVisible && renderTextModal()}
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
    flex: 1,
    alignItems: 'stretch',
    alignContent: 'flex-start',
    borderColor: '#777',
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    padding: 10,
  },
  Keyboardcontainer: {
    flex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  nonBlurredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendTextButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 8,
    backgroundColor: 'rgba(1,1,1,0.5)',
    borderRadius: 70,
  },
  closeTextButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 5,
    backgroundColor: 'rgba(1,1,1,0.5)',
    borderRadius: 70,
  },
  replayButton: {
    position: 'absolute',
    bottom: 20,
    left: 100,
    alignSelf: 'center',
    padding: 5,
    backgroundColor: 'rgba(1,1,1,0.5)',
    borderRadius: 70,
  },

  downloadButton: {
    position: 'absolute',
    bottom: 20,
    right: 100,
    alignSelf: 'center',
    padding: 5,
    backgroundColor: 'rgba(1,1,1,0.5)',
    borderRadius: 70,
  },
  playOrPauseButton: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 5,
    backgroundColor: 'rgba(1,1,1,0.5)',
    borderRadius: 70,
  },
  sendTextTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    padding: 5,
    color: 'white',
  },
  TextModal: {
    position: 'absolute',
    bottom: 2,
    width: '80%',
    height: '15%',
    backgroundColor: 'transparent',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
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
    fontSize: 18,
    paddingBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    left: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButtonContainer: {
    position: 'absolute',
    bottom: 44,
    marginLeft: 3,

    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  openButton: {
    flexDirection: 'row',
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
