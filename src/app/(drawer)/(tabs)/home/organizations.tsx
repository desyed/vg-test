import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';
import {
  BorderRadiuses,
  Chip,
  Colors,
  Image,
  ListItem,
  Text,
  TouchableOpacity,
  View
} from 'react-native-ui-lib';

import { KeyboardAvoidingWrapper } from '../../../../components/ui/KeyboardAvoidingWrapper';
import { LoaderView } from '../../../../components/ui/LoaderView';
import { StandardContainer } from '../../../../components/ui/StandardContainer';
import { useSearchOrganizationUsersQuery } from '../../../../services/organizationApi';
import { useSelector } from "react-redux";

const Organizations = () => {
  const organizationId = useSelector(
    (state) => state?.auth?.user?.selectedOrganizationId
  );
  // @ts-ignore
  const { data, isLoading } = useSearchOrganizationUsersQuery({organizationId});

  console.log(data);

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
              title: 'Organizations',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    router.push('(tabs)/home/add-org-user');
                  }}
                >
                  <View style={{ padding: 10 }}>
                    <Ionicons name="add" size={24} color="black" />
                  </View>
                </TouchableOpacity>
              )
            }}
          />

          <StandardContainer>
            {data &&
              Array.isArray(data) &&
              data?.map((item) => {
                return (
                  <ListItem
                    key={item?.id}
                    activeBackgroundColor={Colors.grey60}
                    activeOpacity={0.3}
                    height={77.5}
                    style={{
                      backgroundColor: Colors.grey70,
                      borderRadius: BorderRadiuses.br20,
                      marginBottom: 10
                    }}
                    onPress={() =>
                      router.push({
                        pathname: '(tabs)/home/add-org-user',
                        params: { id: item.id }
                      })
                    }
                  >
                    <ListItem.Part left>
                      <Image
                        source={{ uri: item?.image || item?.user?.image }}
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
                          grey10
                          text70
                          style={{ flex: 1, marginRight: 10 }}
                          numberOfLines={1}
                        >
                          {item?.name}
                        </Text>
                        {item?.active ? (
                          <Text style={{ marginTop: 2, color: Colors.green20 }}>
                            Active
                          </Text>
                        ) : (
                          <Text style={{ marginTop: 2, color: Colors.green20 }}>
                            Inactive
                          </Text>
                        )}
                      </ListItem.Part>
                      <ListItem.Part>
                        <Text
                          style={{ flex: 1, marginRight: 10 }}
                          text90
                          grey40
                          numberOfLines={1}
                        >
                          {item?.email}
                        </Text>
                        <Text text90 numberOfLines={1}>
                          {item?.role}
                        </Text>
                      </ListItem.Part>
                    </ListItem.Part>
                  </ListItem>
                );
              })}
          </StandardContainer>
        </View>
      </KeyboardAvoidingWrapper>
    </LoaderView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br100,
    marginHorizontal: 14,
    backgroundColor: Colors.white
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});

export default Organizations;
