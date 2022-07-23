
import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { useIsFocused } from "@react-navigation/native";
import { deleteComponent, changeComponentState, retireComponent, syncDataWithStrava,   getLoggedUserData ,connectAccWithStrava,  } from "../modules/firestoreActions";
import {rideSecondsToString ,rideDistanceToString} from '../modules/helpers';
import {isStravaUser, stravaAuthReq, getTokens} from '../modules/stravaApi';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-simple-toast';
import ComponentIcons from "../modules/componentIcons";


const auth = getAuth(firebaseApp)

async function loadComponents(loggedUser, viewRetired) {
  let componentsArray = []  
  let componentsStateQuery = ["active"]
  if(viewRetired)
  {
    componentsStateQuery.push("retired")
  } 
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid)), where("state", "in", componentsStateQuery)))
  componentsDocRef.forEach(component => {
    let componentData = component.data()
    componentData.id = component.id
    componentsArray.push(componentData)
  })
  const promises = componentsArray.map(async comp => {
    if (comp.bike) {
      comp.bike = (await getDoc(comp.bike)).data()
    }
    return comp
  })
  const componentsWithBikeObj = await Promise.all(promises)
  return componentsWithBikeObj
}

export default function AllComponentsListScreen({ navigation, route }) {

  const isFocused = useIsFocused();
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  function runStravaSync()
  {
    setIsSyncing(true)
    syncDataWithStrava(User, setUser).then(() => {
      setIsSyncing(false)
      setIsLoaded(false)
    })
    .catch(()=>{
      Toast.show("Strava synchronization failed")
      setIsSyncing(false)

    })
  }

  //confirm dialog for delete option
  const [showBox, setShowBox] = React.useState(true);
  const showConfirmDialog = (componentId, componentName) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete component " + componentName + " ?",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            deleteComponent(componentId).then(() =>
            setIsLoaded(false))
          },
        },
        {
          text: "No",
        },
      ]
    );
  };




  const [request, response, promptAsync] = stravaAuthReq()
  // connect account with strava on authorization success
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      getTokens(code).then(tokens => {
        return connectAccWithStrava(tokens, User)
      }).then(() => {
       
        return getLoggedUserData()
      }).then((loggedUserData) => {

          let currentUser = getAuth().currentUser
          setIsLoggedIn(false)
          setUser({...loggedUserData, ...currentUser })
          setIsLoggedIn(true)
        })
    }
  }, [response]);


  const [viewRetiredChecked, setviewRetiredChecked] = React.useState(false);

  //set options to menu in stack header 
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
          <MenuOptions>
            <MenuOption onSelect={() => {
              setviewRetiredChecked(!viewRetiredChecked);
            }} 
            text={
              <>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Checkbox
                      color={'#F44336'}
                      status={viewRetiredChecked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setviewRetiredChecked(!viewRetiredChecked);
                      }}
                    />
                    <Text style={{ marginTop: 7.5 }}> View retired</Text>
                  </View>
                </View>
              </>
            }
            style={Styles.menuOption} />

            {isStravaUser(User) && 
            <MenuOption onSelect={() =>
              runStravaSync()
            } text={"Resync strava"} style={Styles.menuOption} />}

            <MenuOption onSelect={async () => { await auth.signOut() }} text={"Log out"} style={Styles.menuOption} />
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, viewRetiredChecked]);



  //components loading
  React.useEffect(() => {
      loadComponents(User, viewRetiredChecked).then((componentsArray) => {
        setComponents(componentsArray)
        setIsLoaded(true)
      })
  }, [isFocused, isLoaded, viewRetiredChecked])
  const [components, setComponents] = React.useState([]);
 



  if (!isLoaded || isSyncing) {
    return (
      <View style={Styles.loadContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        {isSyncing && <Text style={{color:'#F44336', fontSize:16, fontWeight:'700'}}>Syncing strava data</Text>}

        <View style={Styles.addButtonContainer}>
          <FAB
            style={{
              backgroundColor: "#F44336"
            }}
            icon="plus"
            onPress={() => navigation.navigate("AddComponentScreen")}
          />
        </View>
      </View>
    )
  }
  else {
    return (
      <View style={Styles.mainContainer}>
        <ScrollView >
          <StatusBar
            backgroundColor="#F44336"
          />
          <View style={Styles.cardsContainer}>
          {components.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>Add components using '+' button</Text>}

            {components.map(component => {

              const componentOptions = [
                {
                  text: "Edit",
                  onPress: () => {
                    navigation.navigate("AddComponentScreen", {
                      componentId: component.id
                    })
                  }
                },
                {
                  text: "Delete",
                  onPress: () => {
                    showConfirmDialog(component.id, component.name)
                  }} 
              ]
              if(component.state=="active")
              {
                componentOptions.push({
                  text: "Retire",
                  onPress: () => {
                    retireComponent(component.id).then(() =>
                    setIsLoaded(false)
                    )
                  }
                })
              }
              else if(component.state == "retired")
              {
                componentOptions.push({
                  text: "Reactivate",
                  onPress: () => {
                    changeComponentState(component.id, "active").then(() =>
                    setIsLoaded(false)
                    )
                  }
                })
              }
              return <Card key={component.id} options={componentOptions} active={component.state=="active"} title={component.state == "active"? component.name : (component.name + " - retired")} description={component.type.displayName} description2={"Bike: " + (component.bike ? component.bike.name : "Not assigned")} icon={ComponentIcons[component.type.value]} displayInfo={{
                "Distance": rideDistanceToString(component.initialRideDistance+component.rideDistance),
                "Ride Time": rideSecondsToString(component.rideTime + component.initialRideTime)
              }} onPress={() => {
                navigation.navigate('ComponentDetailTabs', {
                  componentId: component.id,
                  componentName: component.name
                })
              }}  ></Card>
            })}

          </View>
        </ScrollView>
        <View style={Styles.addButtonContainer}>
          <FAB
            style={{
              backgroundColor: "#F44336"
            }}
            icon="plus"
            onPress={() => navigation.navigate("AddComponentScreen")}
          />
        </View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  cardsContainer: {
    marginTop: 5,
    alignItems: 'center',
    flex: 9
  },
  addButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingBottom: 30,
    paddingRight: 20,
    zIndex: 99
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuOption: {
    padding: 8
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
})