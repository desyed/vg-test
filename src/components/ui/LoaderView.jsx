import { LoaderScreen, View } from 'react-native-ui-lib';

export const LoaderView = ({ children, isLoading, style = {} }) => (
  <View style={{ flex: 1, position: 'relative', backgroundColor: 'white' }}>
    {isLoading ? (
      <LoaderScreen
        overlay
        loaderColor="#2a544c"
        backgroundColor="rgba(0, 0, 0, 0.8)"
      />
    ) : null}
    {children}
  </View>
);
