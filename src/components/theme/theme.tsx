import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  BorderRadiuses,
  Colors,
  ListItem,
  TouchableOpacity,
  Image,
} from 'react-native-ui-lib';

import { useGetVideoGiftByIdQuery } from '../../services/videoGiftApi';
import { LoaderView } from '../ui/LoaderView';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StandardContainer } from '../ui/StandardContainer';
import { SectionTitle } from '../ui/Title';

const hairlineWidth = StyleSheet.hairlineWidth;

const Theme = ({ videoGiftId }: { videoGiftId: string }) => {
  const { data: videoGiftDetails, isLoading, isFetching } =
    useGetVideoGiftByIdQuery(videoGiftId);

  const router = useRouter();


  return (
    <LoaderView isLoading={isLoading || isFetching}>
      <View style={{ flex: 1 }}>
        <StandardContainer style={{}}>
          <PrimaryButton
            label="Select Theme"
            onPress={() => {
              router.push({
                pathname: '(drawer)/(tabs)/home/select-theme',
                params: { videoGiftId }
              });
            }}
          />
        </StandardContainer>
        <StandardContainer>
          <SectionTitle>Selected Theme</SectionTitle>
        </StandardContainer>

        <StandardContainer style={{ flex: 1 }}>
          <ScrollView>
            {videoGiftDetails && videoGiftDetails?.videoGift?.theme ? (
              <TouchableOpacity>
                <ListItem
                  style={{
                    borderRadius: 5,
                    backgroundColor: 'lightgray'
                  }}
                  activeBackgroundColor={Colors.grey60}
                  activeOpacity={0.3}
                  height={70}
                  onPress={() => {}}
                >
                  <ListItem.Part left>
                    <Image
                      source={{
                        uri: videoGiftDetails?.videoGift?.theme
                          ?.previewImageUrl
                      }}
                      style={styles.image}
                    />
                  </ListItem.Part>
                  <ListItem.Part
                    middle
                    column
                    containerStyle={[styles.border, { paddingRight: 17 }]}
                  >
                    <ListItem.Part containerStyle={{ marginBottom: 3 }}>
                      <Text
                        style={{ flex: 1, marginRight: 10, fontWeight: 'bold' }}
                        numberOfLines={1}
                      >
                        {videoGiftDetails?.videoGift?.theme?.title}
                      </Text>
                    </ListItem.Part>
                  </ListItem.Part>
                </ListItem>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flex: 1,
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                {/*musical-notes-outline*/}
                <Ionicons name="albums-outline" size={32} color="black" />
                <Text>No Theme Selected! Please select a theme.</Text>
              </View>
            )}
          </ScrollView>
        </StandardContainer>
      </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});

export default Theme;
