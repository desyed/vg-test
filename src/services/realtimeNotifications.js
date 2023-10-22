import { Pusher } from '@pusher/pusher-websocket-react-native';
import { store } from 'store';

import { rootApi } from './rootApi';
const pusher = Pusher.getInstance();

export const disconnectPusher = async () => {
  await pusher.disconnect();
};

export const connectPusher = async (user) => {
  await pusher.init({
    apiKey: 'a8539b6b8fa6acc454a2',
    cluster: 'us2',
    // authEndpoint: '<YOUR ENDPOINT URI>',
    onConnectionStateChange: (connection) => {
      console.log('Pusher connection state changed', connection);
    },
    onError: (error) => {
      console.log('Pusher error', error);
    },
    onEvent: (event) => {
      console.log('Pusher event', event);
    }
  });

  await pusher.subscribe({
    channelName: user?.selectedOrganizationId,
    onEvent: (event) => {
      if (event.eventName === 'videoGiftPreviewUpdated') {
        store.dispatch(
          rootApi.util.updateQueryData('getOrders', undefined, (oldData) => {
            console.info('oldData', oldData);
            return oldData?.map((order) => {
              if (order.id === event.data.videoGift?.id) {
                return {
                  ...order,
                  updateDate: new Date(),
                  orderStatus: 'eee',
                  previewDate: event.data.videoGift?.previewDate,
                  signedPreviewUrl: event.data.videoGift?.signedUrl
                };
              }
              return order;
            });
          })
        );
      }
      console.log(`Got channel event: ${event}`);
    }
  });

  await pusher.subscribe({
    channelName: user?.id,
    onEvent: (event) => {}
  });
  await pusher.connect();
};
