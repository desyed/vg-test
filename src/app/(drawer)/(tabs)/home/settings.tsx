import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from "expo-router";
import { ScrollView, Text, View } from 'react-native';
import { Avatar, TouchableOpacity } from "react-native-ui-lib";
import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { useGetMeQuery, useUpdateProfileMutation } from '../../../../services/userApi';

import * as ImagePicker from 'expo-image-picker';
import { sendFile, useGetSignedPutUrlMutation } from 'services/awsApi';
import { useSelector } from "react-redux";
import { useState } from 'react';

function getInitials(name) {

  // Check if name is null or not a string, return empty string if true
  if (typeof name !== 'string' || name === null) {
    return '';
  }
  // Remove any extra spaces and split the name into parts
  const nameParts = name.trim().split(/\s+/);
  // Get the first letter of each part of the name
  const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
  return initials;
}

const Settings = () => {
const [imageKey, setImageKey] = useState((new Date()).toString())
const [isImageLoading, setImageLoading] = useState(false)
  const user = useSelector((state) => state.auth.user)

  const [updateUser] =  useUpdateProfileMutation()
  // @ts-ignore
  const { data, isLoading } = useGetMeQuery();
  const [getSignedUrl, {isLoading: loadingUrl, error}] = useGetSignedPutUrlMutation()

  const pickImage = async () => {
    setImageLoading(true)
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: .5,
    });

    if (!result.canceled) {
      // alert(result.assets[0].uri);
      // check the extentions
      // const key = `user/${user.id}/profileImage.jpeg`;
      // const contentType = `image/jpeg`;
      // const signedUrl = await getSignedUrl({
      //   key, contentType
      // })

      // console.log('#',result.assets[0]);
      //
      // const fetchImageFromUri = async (uri) => {
      //   const response = await fetch(uri);
      //   const blob = await response.blob();
      //   return blob;
      // };
      //
      // const blob = await fetchImageFromUri(result.assets[0].uri)
      //
      //
      // signedUrl && await sendFile(signedUrl?.data.url, blob);

      try{
        await  updateUser({
          image64: result?.assets[0]?.base64
        })

        setImageKey((new Date()).toString())
      }catch (e) {
        console.error(e)
      }


    }
    setImageLoading(false)
  };

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
                onPress={pickImage}
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
