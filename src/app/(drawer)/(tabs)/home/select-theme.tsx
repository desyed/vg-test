import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  BorderRadiuses,
  Chip,
  Colors,
  Image,
  ListItem,
  TouchableOpacity
} from 'react-native-ui-lib';

import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { SectionTitle } from '../../../../components/ui/Title';

const hairlineWidth = StyleSheet.hairlineWidth;

import {
  useGetThemeCategoriesQuery,
  useLazyGetAllThemesQuery
} from '../../../../services/themesApi';
import { usePatchVideoGiftMutation } from '../../../../services/videoGiftApi';

const SelectTheme = () => {
  const [selectedCat, setSelectedCat] = useState('');

  const searchParams = useLocalSearchParams();

  const router = useRouter();

  const [getThemes, { data, isLoading, isFetching }] = useLazyGetAllThemesQuery();
  const [patchVideoGift, { data: res, isLoading: patchLoading }] =
    usePatchVideoGiftMutation();
  const onSelectTheme = (item: any) => {
    patchVideoGift({ id: searchParams?.videoGiftId, themeId: item.id });
  };

  if (!patchLoading && res) {
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

  const { data: category } = useGetThemeCategoriesQuery('');

  return (
    <LoaderView isLoading={isLoading || isFetching || patchLoading}>
      <KeyboardAvoidingWrapper>
        <>
          <StandardContainer>
            <Stack.Screen options={{ headerShown: true, title: '' }} />
            <SectionTitle>Select Themes</SectionTitle>
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
                Array.isArray(category) &&
                category.map((cat) => {
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
          <StandardContainer style={{ flex: 1 }}>
            <ScrollView>
              {data && Array.isArray(data) && data.length > 0 ? (
                data.map((item: any) => {
                  return (
                    <TouchableOpacity key={item.id} style={{marginBottom: 10}}>
                      <ListItem
                        style={{
                          borderRadius: 5,
                          backgroundColor: 'lightgray',
                        }}
                        activeBackgroundColor={Colors.grey60}
                        activeOpacity={0.3}
                        height={70}
                        onPress={() => onSelectTheme(item)}
                      >
                        <ListItem.Part left>
                          <Image
                            source={{ uri: item.previewImageUrl }}
                            style={styles.image}
                          />
                        </ListItem.Part>
                        <ListItem.Part
                          middle
                          column
                          containerStyle={{ paddingRight: 17 }}
                        >
                          <ListItem.Part containerStyle={{}}>
                            <Text
                              style={{
                                flex: 1,
                                marginRight: 10,
                                fontWeight: 'bold'
                              }}
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <Text style={{ marginTop: 2 }}>
                              <Chip label="Select" />
                            </Text>
                          </ListItem.Part>
                        </ListItem.Part>
                      </ListItem>
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
                  <Ionicons name="albums-outline" size={32} color="black" />
                  <Text>No Theme Found!</Text>
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
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14,
    backgroundColor: 'white'
  },
  border: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: Colors.grey70
  }
});

export default SelectTheme;
