import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Chip, TouchableOpacity } from 'react-native-ui-lib';

import { PrimaryButton } from '../ui/PrimaryButton';
import { StandardContainer } from '../ui/StandardContainer';
import { SectionTitle } from '../ui/Title';

import hairlineWidth = StyleSheet.hairlineWidth;

import { Audio } from 'expo-av';
import { useGetBgMusicCategoriesQuery, useSelectedBackgroundMusicQuery } from "../../services/backgroundMusicApi";

const MusicTab = ({videoGiftId}: {videoGiftId: string}) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playing, setPlaying] = useState<number | string | undefined | null>();
  const {data: categories} = useGetBgMusicCategoriesQuery(null)
  if(categories){
    console.log('categories', categories);
  }

  async function playSound(item: any) {
    setPlaying(item?.id);
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      item?.audioUrl,
      null,
      (status) => {
        if (!status?.isPlaying) {
          // setPlaying(null);
          // console.log('sd', status);
        }
      }
    );
    setSound(sound);

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
  const [data, setData] = useState<any[]>([]);

  const {
    data: backgroundMusicList,
    isLoading,
    error
  } = useSelectedBackgroundMusicQuery(videoGiftId);

  if (backgroundMusicList) {
    // debugger;
    console.log('asdf', backgroundMusicList);
  }


  return (
    <View style={{ flex: 1 }}>
      <StandardContainer style={{}}>
        <PrimaryButton
          label="Add Background Music"
          onPress={() => {
            stopSound()
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
        {data && Array.isArray(data) && data.length > 0 ?
          data.map((item: any) => {
            return (
              <TouchableOpacity
                onPress={
                  item.id === playing ? stopSound : () => playSound(item)
                }
              >
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

                    <Ionicons name={item.id === playing ? 'pause' : 'play'} />

                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.name}</Text>
                  <Text>Duration: {item?.duration}</Text>
                </View>
                <TouchableOpacity>
                  <View style={{height: 40, width: 40, alignItems: "center", justifyContent: 'center' }}>
                      <Ionicons color="orange" name="trash" />
                  </View>
                </TouchableOpacity>
              </View>
              </TouchableOpacity>
            );
          }): (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              {/*musical-notes-outline*/}
              <Ionicons name="musical-notes-outline" size={32} color="black" />
              <Text>No Music Selected!</Text>
            </View>
          )}

      </StandardContainer>
    </View>
  );
};



export default MusicTab;
