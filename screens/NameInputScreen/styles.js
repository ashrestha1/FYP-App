import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  choiceContainer: {
    width: '100%',
    height: '100%',
  },
  back: {
    width: '10%',
    marginTop: '20%',
    marginLeft: '2%',
  },
  titles: {
    width: '100%',
    marginTop: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
  },
  input: {
    padding: 8,
    margin: 10,
    marginTop: '5%',
    width: '70%',
    alignContent: 'center',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
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
