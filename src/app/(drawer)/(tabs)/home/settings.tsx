import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from "expo-router";
import { ScrollView, Text, View } from 'react-native';
import { Avatar, TouchableOpacity } from "react-native-ui-lib";
import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { useGetMeQuery, useUpdateProfileMutation } from '../../../../services/userApi';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import * as ImagePicker from 'expo-image-picker';
import { sendFile, useGetSignedPutUrlMutation } from 'services/awsApi';
import { useSelector } from "react-redux";
import { useState } from 'react';
import { createUploadTask, pickImage } from "../../../../utils/uploadUtil";
import { getInitials } from 'utils/utils';



const Settings = () => {
const [imageKey, setImageKey] = useState((new Date()).toString())
const [isImageLoading, setImageLoading] = useState(false)
  const user = useSelector((state) => state.auth.user)

  const [updateUser] =  useUpdateProfileMutation()
  // @ts-ignore
  const { data, isLoading } = useGetMeQuery();
  const [getSignedUrl, {isLoading: loadingUrl, error}] = useGetSignedPutUrlMutation()

const uploadImage = async () => {
    setImageLoading(true)
  const resizedImage = await pickImage()
  const task = await createUploadTask({
    uri: resizedImage?.uri,
    acl: 'public-read',
    onProgress: (e) => {
      console.info('PROGRESS', e);
    },
    filename: 'profile-image.jpg',
    key: `user/${user.id}/profile-image.jpg`
  });

  console.log("v-url",task?.url);

  if (task) {
    try{
      await task.task.uploadAsync();
      await  updateUser({
        image: task?.url
      })
    } catch (e) {
      console.log(e);
    }

  }


  setImageLoading(false)
}

  function getBaseUrl(url) {
    // Find the index of the '?' character
    const queryIndex = url.indexOf('?');

    // If there is no query string, return the original URL
    if (queryIndex === -1) return url;

    // Return the substring from the start to the '?' character
    return url.substring(0, queryIndex);
  }

  return (
    <LoaderView isLoading={isLoading}>
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
              title: 'Settings ',
              headerStyle: { backgroundColor: '#376A60' },
            }}
          />

          <ScrollView>
            <LoaderView
              isLoading={isImageLoading}
              style={{
                height: 200,
                flex: 1,
                backgroundColor: '#376A60',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Avatar
                key={imageKey}
                size={80}
                source={{uri: data?.image}}
                label={getInitials(data?.name)}
                onPress={uploadImage}
                customRibbon={
                  <View
                    style={{
                      backgroundColor: 'lightgray',
                      elevation: 2,
                      borderRadius: 50,
                      display: 'flex',
                      padding: 5,
                      position: 'absolute',
                      top: 45,
                      left: 10
                    }}
                  >
                    <Ionicons color="#376A60" name="chevron-forward-outline" />
                  </View>
                }
                badgePosition="BOTTOM_RIGHT"
              />
            </LoaderView>

            <StandardContainer>
              <Text style={{marginVertical: 15, color: "#376A60"}}>
                Basic Information
              </Text>

              <View style={{flex: 1, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", paddingRight: 30}}>
                <Text style={{fontWeight: "bold"}}>Name</Text>
                <Text style={{color: "gray"}}>{data?.name}</Text>
              </View>


              <View style={{flex: 1, marginVertical: 10,  flexDirection: "row", justifyContent: "space-between", paddingRight: 30}}>
                <Text style={{fontWeight: "bold"}}>Email</Text>
                <Text style={{color: "gray"}}>{data?.email}</Text>
              </View>


              <View style={{flex: 1, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", paddingRight: 30}}>
                <Text style={{fontWeight: "bold"}}>Organizations</Text>
                <Text style={{color: "gray"}}>{data?.organizationMember?.map(item => item?.name + ` (${item?.role})`).join()}</Text>
              </View>

              <Text style={{marginVertical: 15, color: "#376A60"}}>
                Actions
              </Text>

              <TouchableOpacity style={{flex: 1,marginVertical: 10,  flexDirection: "row", justifyContent: "space-between", paddingRight: 30}}
                onPress={() => router.push('(tabs)/home/change-password')}>
                  <Text style={{fontWeight: "bold"}}>Change Password</Text>
                  <Text style={{color: "gray"}}><Ionicons color="#376A60" name="chevron-forward-outline"/></Text>
              </TouchableOpacity>

            </StandardContainer>
          </ScrollView>


        </View>
      </KeyboardAvoidingWrapper>
    </LoaderView>
  );
};

export default Settings;
