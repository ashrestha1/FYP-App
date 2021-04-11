import React from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
// import Slider from '@react-native-community/slider';
import Slider from 'react-native-slider';
import { Icon } from 'native-base';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import * as Icons from '../../components/Icons';

import { ProgressBar } from 'react-native-paper';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = 'transparent';
const LIVE_COLOR = '#FF0000';

type Props = {
  name: string;
};

type State = {
  haveRecordingPermissions: boolean;
  isLoading: boolean;
  isPlaybackAllowed: boolean;
  muted: boolean;
  soundPosition: number | null;
  soundDuration: number | null;
  recordingDuration: number | null;
  shouldPlay: boolean;
  isPlaying: boolean;
  isRecording: boolean;
  fontLoaded: boolean;
  shouldCorrectPitch: boolean;
  volume: number;
  rate: number;
  textValue: string;
};

export default class RecordClass extends React.Component<Props, State> {
  private recording: Audio.Recording | null;
  private sound: Audio.Sound | null;
  private isSeeking: boolean;
  private shouldPlayAtEndOfSeek: boolean;
  private readonly recordingSettings: Audio.RecordingOptions;

  constructor(props: Props) {
    super(props);
    this;
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: false,
      volume: 1.0,
      rate: 1.0,
      textValue: 'He loved eating his bananas in hot dog buns.',
    };
    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

    // UNCOMMENT THIS TO TEST maxFileSize:
    /* this.recordingSettings = {
      ...this.recordingSettings,
      android: {
        ...this.recordingSettings.android,
        maxFileSize: 12000,
      },
    };*/
  }

  componentDidMount() {
    (async () => {
      await Font.loadAsync({
        'cutive-mono-regular': require('../../assets/fonts/CutiveMono-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();
  }

  private _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };

  private _updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis ?? null,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
    }
  };

  private _updateScreenForRecordingStatus = (status: Audio.RecordingStatus) => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  private async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  private async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    if (!this.recording) {
      return;
    }
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // On Android, calling stop before any data has been collected results in
      // an E_AUDIO_NODATA error. This means no audio data has been written to
      // the output file is invalid.
      if (error.code === 'E_AUDIO_NODATA') {
        console.log(
          `Stop was called too quickly, no data has yet been received (${error.message})`
        );
      } else {
        console.log('STOP ERROR: ', error.code, error.name, error.message);
      }
      this.setState({
        isLoading: false,
      });
      return;
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI() || '');

    console.log(info.uri);
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
  }

  private _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  private _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  private _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  private sentenceChange = () => {
    this.setState({ textValue: 'sentence2' });
  };

  private _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  private _onVolumeSliderValueChange = (value: number) => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  private _onSeekSliderValueChange = (value: number) => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  private _onSeekSliderSlidingComplete = async (value: number) => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * (this.state.soundDuration || 0);
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  private _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  private _getMMSSFromMillis(millis: number) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  private _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return '';
  }

  private _getPlaybackTimestampPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(this.state.soundPosition)}`;
    }
    return '';
  }
  private _getPlaybackTimestampDuration() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return '';
  }

  private _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  render() {
    if (!this.state.fontLoaded) {
      return <View style={styles.emptyContainer} />;
    }

    if (!this.state.haveRecordingPermissions) {
      return (
        <View style={styles.container}>
          <View />
          <Text
            style={[
              styles.noPermissionsText,
              { fontFamily: 'cutive-mono-regular' },
            ]}
          >
            You must enable audio recording permissions in order to use this
            app.
          </Text>
          <View />
        </View>
      );
    }

    return (
      <View style={[styles.container, { padding: 15 }]}>
        <View
          style={[styles.halfScreenContainer, { backgroundColor: 'white' }]}
        >
          <View
            style={{ alignSelf: 'flex-start', marginLeft: 10, marginTop: 20 }}
          >
            <TouchableOpacity>
              <Icon name="return-up-back" style={{ color: 'black' }} />
            </TouchableOpacity>
          </View>
          <View />
          <View style={styles.recordingContainer}>
            <View />

            <View
              style={{
                justifyContent: 'center',
                marginTop: -30,
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 21, fontWeight: '500' }}>
                {this.state.textValue}
              </Text>
            </View>

            <View />
          </View>
          <View />
        </View>

        <View
          style={[
            styles.halfScreenContainer,
            {
              backgroundColor: '#F8F8F8',
              borderTopColor: '#E0E0E0',
              borderTopWidth: 2,
              padding: 20,
            },
          ]}
        >
          <View
            style={{
              marginBottom: 5,
              marginTop: 20,
              flexDirection: 'row',
              width: '100%',
              alignContent: 'space-between',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontWeight: '500' }}>Sentences recorded:</Text>
            <Text style={{ fontWeight: '500' }}>10%</Text>
          </View>
          <ProgressBar
            progress={0.1}
            color={'#00BFFF'}
            style={{ width: 300, backgroundColor: '#DCDCDC', marginBottom: 40 }}
          />

          <View />
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={{ borderRadius: 400 }}
            onPress={this._onRecordPressed}
            disabled={this.state.isLoading}
          >
            <Icon
              name={
                this.state.isRecording ? 'ios-mic-sharp' : 'ios-mic-outline'
              }
              style={[
                styles.microphoneIcon,
                { color: this.state.isRecording ? '#ff3232' : 'black' },
              ]}
            />
          </TouchableHighlight>
          <View style={styles.recordingDataContainer}>
            <View />
            <View style={styles.recordingDataRowContainer}>
              <Text
                style={[
                  styles.recordingTimestamp,
                  {
                    fontWeight: '500',
                    fontSize: 10,
                    opacity: this.state.isRecording ? 1.0 : 0.0,
                  },
                ]}
              >
                {this._getRecordingTimestamp()}
              </Text>
            </View>
            <View />
          </View>
          <View style={styles.playbackContainer}>
            <Slider
              style={styles.playbackSlider}
              thumbStyle={{
                width: 10,
                height: 10,
                backgroundColor: '#31a4db',
                borderRadius: 10 / 2,
                shadowColor: '#31a4db',
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 2,
                shadowOpacity: 1,
              }}
              minimumTrackTintColor="#31a4db"
              maximumTrackTintColor="#DCDCDC"
              value={this._getSeekSliderPosition()}
              onValueChange={this._onSeekSliderValueChange}
              onSlidingComplete={this._onSeekSliderSlidingComplete}
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text
                style={[
                  styles.playbackTimestamp,
                  { fontWeight: '500', fontSize: 10 },
                ]}
              >
                {this._getPlaybackTimestampPosition()}
              </Text>
              <Text
                style={[
                  styles.playbackTimestamp,
                  { fontWeight: '500', fontSize: 10 },
                ]}
              >
                {this._getPlaybackTimestampDuration()}
              </Text>
            </View>
          </View>
          <View
            style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}
          >
            <View style={styles.playStopContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onPlayPausePressed}
                disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              >
                <Icon
                  style={styles.image}
                  name={this.state.isPlaying ? 'pause-sharp' : 'play-sharp'}
                />
              </TouchableHighlight>
            </View>
            <View />
          </View>

          <View />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT,
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  wrapper: {},
  halfScreenContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  recordingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
  },
  recordingDataContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  microphoneIcon: {
    fontSize: 80,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
  },
  playbackContainer: {
    flex: 0,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: Icons.THUMB_1.height * 2.0,
    maxHeight: Icons.THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
    height: 30,
  },
  liveText: {
    color: LIVE_COLOR,
  },
  recordingTimestamp: {},
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    marginTop: -4,
  },
  image: {
    backgroundColor: BACKGROUND_COLOR,
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainerTopRow: {
    maxHeight: Icons.MUTED_BUTTON.height,
    alignSelf: 'stretch',
  },
  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - Icons.MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: Icons.THUMB_1.height,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  timestamp: {
    fontFamily: 'cutive-mono-regular',
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});
