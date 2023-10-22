import { StyleSheet, Text } from 'react-native';

import { Stack } from './Stack';

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: 111,
    height: 128,
    borderRadius: 8
  },
  label: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter_900Black'
  },
  value: {
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    fontWeight: '700'
  }
});

export const StatCard = ({ backgroundColor, label, value, style = {} }) => (
  <Stack style={[styles.container, { backgroundColor }]}>
    <Text style={[styles.label, style]}>{label}</Text>
    <Text style={[styles.value, style]}>{value}</Text>
  </Stack>
);
