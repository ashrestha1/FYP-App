import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  choiceContainer: {
    width: '100%',
    height: '100%',
  },
  titles: {
    marginTop: '30%',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    color: '#5c5e62',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 50,
  },
  container: {
    width: '100%',
    padding: 10,
  },
  button: {
    backgroundColor: 'white',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default styles;
