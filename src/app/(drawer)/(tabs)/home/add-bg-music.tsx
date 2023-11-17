import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip, TouchableOpacity } from 'react-native-ui-lib';

import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { SectionTitle } from '../../../../components/ui/Title';
import { useSelectedBackgroundMusicQuery } from '../../../../services/backgroundMusicApi';

import hairlineWidth = StyleSheet.hairlineWidth;

const AddBgMusic = () => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playing, setPlaying] = useState<number | string | undefined | null>();

  async function playSound(id: string | number) {
    setPlaying(id);
    const { sound } = await Audio.Sound.createAsync(
      require('../../../../images/track.wav'),
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
    console.log('asdf', backgroundMusicList);
  }
  return (
    <KeyboardAvoidingWrapper>
      <>
        <StandardContainer>
          <Stack.Screen options={{ headerShown: true, title: '' }} />
          <SectionTitle>Select Background Music</SectionTitle>
        </StandardContainer>
        <StandardContainer>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            <TouchableOpacity>
              <View style={styles.capsuleActive}>
                <Text style={{ color: 'black' }}>All</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </StandardContainer>
        <StandardContainer>
          <ScrollView>
            {data &&
              data.map((item: any) => {
                return (
                  <TouchableOpacity
                    onPress={
                      () => router.back()
                      // item.id === playing ? stopSound : () => playSound(item.id)
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
                      <TouchableOpacity
                        onPress={
                          item.id === playing
                            ? stopSound
                            : () => playSound(item.id)
                        }
                      >
                        <View
                          style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 50
                          }}
                        >
                          <Ionicons
                            name={item.id === playing ? 'pause' : 'play'}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                        <Text>Artist: abc</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </StandardContainer>
      </>
    </KeyboardAvoidingWrapper>
  );
};

const styles = StyleSheet.create({
  capsuleActive: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: 'green'
  },
  capsule: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: hairlineWidth,
    borderColor: 'gray'
  }
});

export default AddBgMusic;
