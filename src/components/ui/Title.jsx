import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    fontWeight: '700',
    fontFamily: 'Inter_900Black'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_900Black'
  }
});

export const Title = ({ children, style = {} }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

export const SectionTitle = ({ children, style = {} }) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);
