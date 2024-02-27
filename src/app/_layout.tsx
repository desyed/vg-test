import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from 'store';

import 'expo-dev-client';
import { SessionProvider } from '../ctx';

// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://6cd374dddce41891dd155e5916dfbcd1@o558373.ingest.sentry.io/4506255428550656'
// });

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <Provider store={store}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </Provider>
  );
}
