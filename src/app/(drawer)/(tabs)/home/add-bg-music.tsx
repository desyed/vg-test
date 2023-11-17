import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from 'react-native-ui-lib';

import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { SectionTitle } from '../../../../components/ui/Title';
import hairlineWidth = StyleSheet.hairlineWidth;
import { KeyboardAvoidingWrapper } from "../../../../components/ui/KeyboardAvoidingWrapper";
import { useGetAllBgMusicQuery } from "../../../../services/backgroundMusic";


const AddBgMusic = () => {
  const router = useRouter();

  const { data } = useGetAllBgMusicQuery('');
  return (
    <KeyboardAvoidingWrapper>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add Background Music'
        }}
      />
      <StandardContainer>
        <SectionTitle>Background Musics</SectionTitle>
      </StandardContainer>

      <StandardContainer>
        {data.map((item: any) => {
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
                <TouchableOpacity>
                  <Ionicons name="play" />
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
    </KeyboardAvoidingWrapper>
  );
};

export default AddBgMusic;
