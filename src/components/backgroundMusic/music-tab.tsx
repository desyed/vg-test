import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Chip, TouchableOpacity } from 'react-native-ui-lib';

import { useGetSelectedMediaQuery } from '../../services/mediaApi';
import { useSelectedBackgroundMusicQuery } from '../../services/videoGiftApi';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StandardContainer } from '../ui/StandardContainer';
import { SectionTitle } from '../ui/Title';

import hairlineWidth = StyleSheet.hairlineWidth;

import { Audio } from 'expo-av';

const MusicTab = () => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playing, setPlaying] = useState<number | string | undefined | null>();

  async function playSound(id: string | number) {
    setPlaying(id);
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../../images/track.wav'),
      null,
      (status) => {
        if (!status?.isPlaying) {
          // setPlaying(null);
          console.log('sd', status);
        }
      }
    );
    setSound(sound);



    console.log('Playing Sound');
    await sound.playAsync();
  }

  async function stopSound() {
    setPlaying(null);
    await sound.stopAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const router = useRouter();
  const [data, setData] = useState([
    {
      id: 1,
      title: 'title 1'
    },
    {
      id: 2,
      title: 'title:2'
    }
  ]);

  const {
    data: backgroundMusicList,
    isLoading,
    error
  } = useSelectedBackgroundMusicQuery('searchParams?.videoGiftId');

  if (backgroundMusicList) {
    // debugger;
    console.log(backgroundMusicList);
  }

  return (
    <View style={{ flex: 1 }}>
      <StandardContainer style={{}}>
        <PrimaryButton
          label="Add Background Music"
          onPress={() => {
            router.push({
              pathname: '(drawer)/(tabs)/home/add-bg-music',
              params: { videoGiftId: 'searchParams?.videoGiftId ' }
            });
          }}
        />
      </StandardContainer>
      <StandardContainer>
        <SectionTitle>Selected Background Music</SectionTitle>
      </StandardContainer>
      <StandardContainer>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          <Chip backgroundColor="green" label="All" onPress={() => console.log('pressed')} />
          <Chip label="Happy" onPress={() => console.log('pressed')} />
          <Chip label="Festive" onPress={() => console.log('pressed')} />
          <Chip label="Chrismas" onPress={() => console.log('pressed')} />
          <Chip label="Charming" onPress={() => console.log('pressed')} />
        </ScrollView>
      </StandardContainer>

      <StandardContainer>
        {data &&
          data.map((item: any) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  paddingBottom: 10,
                  marginBottom: 10,
                  borderBottomWidth: hairlineWidth,
                  borderColor: '#fff'
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 50
                  }}
                >
                  <TouchableOpacity
                    onPress={
                      item.id === playing ? stopSound : () => playSound(item.id)
                    }
                  >
                    <Ionicons name={item.id === playing ? 'pause' : 'play'} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.title}</Text>
                  <Text>Artist: abc</Text>
                </View>
                <View>
                  <TouchableOpacity>
                    <Ionicons color="orange" name="trash" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
      </StandardContainer>
    </View>
  );
};

export default MusicTab;
