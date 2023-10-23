import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(4, 1, 20, 0.05)',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,

    boxShadow: '0px 4px 9px 0px rgba(4, 1, 20, 0.05)'
  },
  date: {
    color: '#9C9C9C',

    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter_900Black',
    lineHeight: 20
  },
  title: {
    color: '#000',

    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_900Black',
    lineHeight: 24
  },
  name: {
    color: '#000',

    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter_900Black',
    lineHeight: 24
  },
  email: {
    color: '#777',

    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter_900Black',
    lineHeight: 24
  },
  bar: {
    width: 31,
    height: 3,
    borderRadius: 6,
    backgroundColor: '#D96150'
  }
});

export const OrderItemCard = ({
  children,
  date,
  title,
  name,
  email,
  onPress
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.container]}>
      <View style={styles.bar} />
      <Text style={[styles.date]}>{date}</Text>
      <Text style={[styles.title]}>{title}</Text>
      <Text style={[styles.name]}>{name}</Text>
      <Text style={[styles.email]}>{email}</Text>
    </View>
  </TouchableOpacity>
);
