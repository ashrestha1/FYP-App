import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
