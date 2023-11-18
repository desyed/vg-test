import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip, TouchableOpacity } from 'react-native-ui-lib';

import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { SectionTitle } from '../../../../components/ui/Title';
import {
  useGetBgMusicCategoriesQuery,
  useLazyGetAllBgMusicQuery,
  useSelectBgMusicMutation
} from '../../../../services/backgroundMusicApi';

import hairlineWidth = StyleSheet.hairlineWidth;

const AddBgMusic = () => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [selectedCat, setSelectedCat] = useState('');
  const [playing, setPlaying] = useState<number | string | undefined | null>();
  const searchParams = useLocalSearchParams();
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

  const [getMusics, { data, isLoading }] = useLazyGetAllBgMusicQuery();

  if(data){
    console.log('music', data);
  }

  const [selectBgMusic, { data: res, isLoading: selectLoading }] =
    useSelectBgMusicMutation();

  const onSelectMusic = (id) => {
    selectBgMusic({ videoGiftId: String(searchParams?.videoGiftId), backgroundMusicId: id })
  }

  if(!selectLoading && res ){
    router.back()
  }

  useEffect(() => {
    getMusics('');
  }, []);

  const changeSelectedCat = (catId) => {
    setSelectedCat(catId);
    // get musics
    getMusics(catId)
  };

  const { data: category } = useGetBgMusicCategoriesQuery('');

  return (
    <LoaderView isLoading={isLoading || selectLoading}>
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
              <TouchableOpacity onPress={() => changeSelectedCat('')}>
                <View
                  style={
                    selectedCat === '' ? styles.capsuleActive : styles.capsule
                  }
                >
                  <Text
                    style={{ color: selectedCat === '' ? 'white' : 'black' }}
                  >
                    All
                  </Text>
                </View>
              </TouchableOpacity>

              {category &&
                Array.isArray(category?.data) &&
                category.data.map((cat) => {
                  return (
                    <TouchableOpacity
                      onPress={() => changeSelectedCat(cat?.id)}
                    >
                      <View
                        style={
                          selectedCat === cat?.id
                            ? styles.capsuleActive
                            : styles.capsule
                        }
                      >
                        <Text
                          style={{
                            color: selectedCat === cat.id ? 'white' : 'black'
                          }}
                        >
                          {cat?.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </StandardContainer>
          <StandardContainer>
            <ScrollView>
              {data && Array.isArray(data?.data) && data.data.length > 0 ? (
                data.data.map((item: any) => {
                  return (
                    <TouchableOpacity
                      onPress={
                        () => onSelectMusic(item?.id)
                        // item.id === playing ? stopSound : () => playSound(item.id)
                      }
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                          padding: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                          borderBottomWidth: hairlineWidth,
                          borderColor: '#fff',
                          backgroundColor: 'lightgray'
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
                          <Text style={{ fontWeight: 'bold' }}>
                            {item?.name}
                          </Text>
                          {/*<Text>Category: </Text>*/}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View
                  style={{
                    flex: 1,
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {/*musical-notes-outline*/}
                  <Ionicons
                    name="musical-notes-outline"
                    size={32}
                    color="black"
                  />
                  <Text>No Music Found!</Text>
                </View>
              )}
            </ScrollView>
          </StandardContainer>
        </>
      </KeyboardAvoidingWrapper>
    </LoaderView>
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
