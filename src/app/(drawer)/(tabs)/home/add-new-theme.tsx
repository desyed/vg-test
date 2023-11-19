import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Chip, TouchableOpacity } from "react-native-ui-lib";

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

import {
  useGetThemeCategoriesQuery,
  useLazyGetAllThemesQuery
} from '../../../../services/themesApi';
import { getInitials } from '../../../../utils/utils';
import { TextInput } from '../../../../components/ui/form/TextInput';
import { SelectInput } from '../../../../components/ui/form/SelectInput';
import { PrimaryButton } from '../../../../components/ui/PrimaryButton';

const AddTheme = () => {
  const [selectedCat, setSelectedCat] = useState('');

  const searchParams = useLocalSearchParams();

  const router = useRouter();

  const [getThemes, { data, isLoading }] = useLazyGetAllThemesQuery();

  const [selectBgMusic, { data: res, isLoading: selectLoading }] =
    useSelectBgMusicMutation();

  const onSelectMusic = (id) => {
    selectBgMusic({
      videoGiftId: String(searchParams?.videoGiftId),
      backgroundMusicId: id
    });
  };

  if (!selectLoading && res) {
    router.back();
  }

  useEffect(() => {
    getThemes('');
  }, []);

  const changeSelectedCat = (catId) => {
    setSelectedCat(catId);
    // get musics
    getThemes(catId);
  };

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: '',
      themeCategoryId: '',
      previewImageUrl: '',
      isCompanyTheme: false
    }
  });

  const { data: category } = useGetThemeCategoriesQuery('');

  return (
    <LoaderView isLoading={false}>
      <KeyboardAvoidingWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%'
          }}
        >
          <Stack.Screen
            options={{
              headerShown: true,
              title: ''
            }}
          />

          <StandardContainer>
            <SectionTitle>
              {searchParams?.id ? 'Update' : 'Create'} Theme
            </SectionTitle>
          </StandardContainer>
          <StandardContainer>
            <TextInput
              control={control}
              rules={{ required: 'Title is required' }}
              name="title"
              label="Title"
              placeholder="Title"
              textInputProps={{
                returnKeyType: 'next',
                // autoCapitalize: '',
                // keyboardType: 'email-address',
                autoCorrect: false
              }}
            />

            {/*<TextInput*/}
            {/*  control={control}*/}
            {/*  name="description"*/}
            {/*  label="Image"*/}
            {/*  rules={{required: 'Theme Category is required'}}*/}
            {/*  placeholder="Upload an image"*/}
            {/*  textInputProps={{ returnKeyType: 'next', autoCorrect: false }}*/}
            {/*/>*/}
            <View>
              <Text style={{marginVertical: 10, fontWeight: 'bold'}}>Upload Image</Text>
              <View style={{backgroundColor: '#d1d1d1', height: 150, width: 150, marginBottom: 8, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Upload</Text>
              </View>

            </View>
            <SelectInput
              items={_.map(category, (cat) => ({
                value: cat?.id,
                label: cat?.name
              }))}
              label="Theme Category"
              control={control}
              name="themeCategoryId"
              rules={{
                required: 'Theme Category is required'
              }}
              placeholder="Select category"
              textInputProps={{
                returnKeyType: 'next'
              }}
              // inputProps={{ label: 'Assigned To' }}
            />
            <SelectInput
              items={_.map([true, false], (val) => ({
                value: val,
                label: val ? 'Yes' : 'No'
              }))}
              label="Company theme?"
              control={control}
              name="isCompanyTheme"
              placeholder=""
              textInputProps={{
                returnKeyType: 'next'
              }}
              // inputProps={{ label: 'Assigned To' }}
            />
          </StandardContainer>
          <StandardContainer>
            <PrimaryButton
              label={`${searchParams?.id ? 'Update' : 'Create'} User`}
              // onPress={handleSubmit(onSubmit)}
              // loading={isUpdateLoading || createLoading}
            />
          </StandardContainer>
        </View>
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

export default AddTheme;
