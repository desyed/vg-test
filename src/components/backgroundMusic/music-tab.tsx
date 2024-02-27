import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-ui-lib';
import { useSelector } from "react-redux";

import {
  useRemoveSelectedBackgroundMusicMutation,
  useSelectedBackgroundMusicQuery
} from '../../services/backgroundMusicApi';
import { LoaderView } from '../ui/LoaderView';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StandardContainer } from '../ui/StandardContainer';
import { SectionTitle } from '../ui/Title';
import _ from "lodash";

const hairlineWidth = StyleSheet.hairlineWidth;

const MusicTab = ({ videoGiftId }: { videoGiftId: string }) => {
  const organizationId = useSelector(state => state?.auth?.user?.selectedOrganizationId)
  const [sound, setSound] = useState<Audio.Sound>();
  const [playing, setPlaying] = useState<number | string | undefined | null>();

  async function playSound(item: any) {
    setPlaying(item?.id);
    const { sound } = await Audio.Sound.createAsync({
      uri: item?.backgroundMusic?.audioUrl
    });
    setSound(sound);

    await sound.playAsync();
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
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : _.noop;
  }, [sound]);

  const router = useRouter();

  const { data, isLoading, isFetching, error } =
    useSelectedBackgroundMusicQuery({ videoGiftId, organizationId });

  const [removeMusic, { data: deleteRes, isLoading: deleteLoading }] =
    useRemoveSelectedBackgroundMusicMutation();

  console.log('musics', data);

  const onDeleteItem = (id) => {
    removeMusic({ videoGiftId, bgMusicId: id, organizationId });
  };

  return (
    <LoaderView isLoading={isLoading || isFetching || deleteLoading}>
      <View style={{ flex: 1 }}>
        <StandardContainer style={{}}>
          <PrimaryButton
            label="Add Background Music"
            onPress={() => {
              stopSound();
              router.push({
                pathname: '(drawer)/(tabs)/home/add-bg-music',
                params: { videoGiftId }
              });
            }}
          />
        </StandardContainer>
        <StandardContainer>
          <SectionTitle>Selected Background Music</SectionTitle>
        </StandardContainer>

        <StandardContainer>
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((item: any) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={
                    item.id === playing ? stopSound : () => playSound(item)
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
                      <Text>{item?.backgroundMusic?.name}</Text>
                      <Text>Duration: {item?.backgroundMusic?.duration}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onDeleteItem(item?.id)}>
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ffffff40',
                          borderRadius: 5
                        }}
                      >
                        <Ionicons size={16} color="orange" name="trash" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View
              style={{
                height: 200,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/*musical-notes-outline*/}
              <Ionicons name="musical-notes-outline" size={32} color="black" />
              <Text>No Music Selected!</Text>
            </View>
          )}
        </StandardContainer>
      </View>
    </LoaderView>
  );
};

export default MusicTab;
