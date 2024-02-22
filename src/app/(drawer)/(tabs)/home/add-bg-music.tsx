import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Colors, TouchableOpacity } from 'react-native-ui-lib';

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
import { useSelector } from "react-redux";

const Item = ({
  data: { item },
  onSelectMusic,
  playing,
  playSound,
  stopSound
}: any) => {
  return (
    <StandardContainer style={{marginBottom: 0, marginTop: 0}}>
      <TouchableOpacity key={item?.id}
                        onPress={() => {
                          onSelectMusic(item?.id)
                        }}>
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
            onPress={item?.id === playing ? stopSound : () => playSound(item)}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 50
              }}
            >
              <Ionicons name={item?.id === playing ? 'pause' : 'play'} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item?.name}</Text>
            {/*<Text>Category: </Text>*/}
          </View>
        </View>
      </TouchableOpacity>
    </StandardContainer>
  );
};
const AddBgMusic = () => {
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );
  const [sound, setSound] = useState<Audio.Sound>();
  const [selectedCat, setSelectedCat] = useState('');
  const [playing, setPlaying] = useState<number | string | undefined | null>();
  const searchParams = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  async function playSound(item: any) {
    try {
      setPlaying(item?.id);
      const { sound } = await Audio.Sound.createAsync({ uri: item?.audioUrl });
      setSound(sound);
      await sound.playAsync();
    } catch (e) {
      console.error(e);
    }
  }

  async function stopSound() {
    setPlaying(null);
    try {
      await sound?.stopAsync();
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          try {
            sound.unloadAsync();
          } catch (e) {
            console.log(e);
          }
        }
      : undefined;
  }, [sound]);

  const router = useRouter();

  const [getMusics, { data, isLoading, isFetching, isSuccess }] =
    useLazyGetAllBgMusicQuery();

  const [selectBgMusic, { data: res, isLoading: selectLoading }] =
    useSelectBgMusicMutation();

  const onSelectMusic = (id) => {
    selectBgMusic({
      videoGiftId: String(searchParams?.videoGiftId),
      backgroundMusicId: id,
      organizationId
    });
  };

  if (!selectLoading && res) {
    router.back();
  }

  useEffect(() => {
    if(data?.metaData){
      setCurrentPage(data?.metaData?.page)
    }
  }, [data?.metadata]);

  useEffect(() => {
    getMusics({ catId: '', page: 1 });
  }, []);

  const changeSelectedCat = (catId) => {
    setSelectedCat(catId);
    // @ts-ignore
    getMusics({ catId, page: currentPage }, { preferCacheValue: true});
  };

  const { data: category } = useGetBgMusicCategoriesQuery('');
  const keyExtractor = (item) => item.id;
  const onRefresh = () => {
    getMusics({ catId: selectedCat, page: currentPage });
  };
  const fetchMore = () => {
    // @ts-ignore
    getMusics({ catId: selectedCat, page: currentPage });
  }

  return (
    <LoaderView isLoading={isFetching}>
      {/*<KeyboardAvoidingWrapper>*/}
            <FlatList
              style={{backgroundColor: 'white'}}
              data={data?.data || []}
              // extraData={updateData}
              renderItem={(item) => (<Item
                data={item}
                playing={playing}
                stopSound={stopSound}
                onSelectMusic={onSelectMusic}
                playSound={playSound}
              />)}
              keyExtractor={keyExtractor}
              onRefresh={() => onRefresh()}
              refreshing={false}
              onEndReachedThreshold={0.2}
              onEndReached={() => fetchMore()}
              ListHeaderComponent={<>
                <StandardContainer style={{marginBottom: 0}}>
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
                            key={cat?.id}
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
              </>}
            />
      {/*</KeyboardAvoidingWrapper>*/}
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
