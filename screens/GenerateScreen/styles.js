import { StyleSheet, Dimensions } from 'react-native';
const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c5c4',
    opacity: 0.7,
    zIndex: 2,
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
  },

  nonBlurredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    margin: 220,
    width: 350,
    backgroundColor: 'white',
    padding: 50,
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
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,

    justifyContent: 'space-between',
  },
  buttonContainer: {},
  button: {},
  text: {
    fontSize: 18,
    color: 'white',
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,

    justifyContent: 'space-between',
  },
  buttonContainer: {},
  button: {},
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default styles;
