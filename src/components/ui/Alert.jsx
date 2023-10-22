import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFD1D1',
    minHeight: 50,
    fontSize: 35,
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    gap: 10
  },
  title: {
    color: '#D8070B',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Inter_900Black'
  },
  body: {
    color: '#000000',
    fontFamily: 'Inter_900Black',
    fontSize: 12
  }
});

export const ErrorAlert = ({ children = '', title, style = {} }) => (
  <View style={[styles.container]}>
    {title ? <Text style={[styles.title]}>{title}</Text> : null}
    {children ? <Text style={styles.body}>{children}</Text> : null}
  </View>
);
