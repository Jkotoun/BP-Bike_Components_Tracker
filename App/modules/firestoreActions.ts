

import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteField, increment, addDoc, orderBy, DocumentReference, deleteDoc, setDoc } from 'firebase/firestore';
import { getAllBikes, getStravaGear, getAllActivities } from './stravaApi';
import { getAuth } from 'firebase/auth';
import { getStorage, getDownloadURL, ref, deleteObject } from 'firebase/storage';


interface bikeType
{
    label: string,
    value: string
}

interface bike
{
    brand: string,
    model: string,
    name: string,
    purchaseDate: Date|Object, //can be Datetime or Object with seconds and nanoseconds
    rideDistance?: number,
    rideTime?: number,
    initialRideDistance?: number,
    initialRideTime?: number,
    state:string,
    type: bikeType,
    user: DocumentReference
}
interface stravaBike extends bike
{
    stravaSynced: boolean,
    stravaId: string
}

interface ride
{
    name: string,
    date: Date,
    distance: number,
    rideTime: number,
    elevationGain?: number,
    maxSpeed?: number,
    avgSpeed?: number,
    elapsedTime?: number,
    user?: DocumentReference,
    bike: DocumentReference|null
}

interface stravaRide extends ride
{
    stravaSynced: boolean,
    stravaId: string
}


interface stravaInfo
{
    accessToken: string,
    accessTokenExpiration: Date,
    refreshToken: string
}

/**
 * @returns Promise object with users rides, which were imported from Strava api
 */
export async function getAllStravaSyncedRides()
{
    return getDocs(
        query(
            collection(getFirestore(firebaseApp), "rides"), 
            where("stravaSynced", "==", true), 
            where("user", "==", doc(getFirestore(firebaseApp), "users", getAuth(firebaseApp).currentUser.uid))
            )
        )
}

/**
 * 
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns rides from strava api
 */
export async function getAllStravaRides(User, setUser)
{
    let activities = (await getAllActivities(User, setUser))
    return activities.filter(activity => activity.type == "Ride")
}


/**
 * Update user strava api access object
 * @param stravaInfo strava api access data object (access token, refresh token, access token expiration) 
 * @returns firestore doc update promise
 */
export async function updateUserStravaTokens(stravaInfo: stravaInfo)
{
    return updateDoc(doc(getFirestore(firebaseApp), "users", getAuth().currentUser.uid), 
    {
        "stravaInfo": stravaInfo
    })
}
/**
 * 
 * @returns Authenticated user data
 */
export async function getLoggedUserData()
{
    return (await getDoc(doc(getFirestore(firebaseApp), "users", getAuth().currentUser.uid))).data()
}

/**
 * 
 * @returns users bikes which were immported from strava api
 */
export async function getAllStravaSyncedBikes()
{
    let authUser = getAuth(firebaseApp)
    return getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("stravaSynced", "==", true), where("user", "==", doc(getFirestore(firebaseApp), "users", authUser.currentUser.uid))))
}

/**
 * Updates bike document with new data
 * @param bikeRef bike firestore document reference
 * @param data object with new bike data 
 * @returns firestore document update promise
 */
export async function updateBike(bikeRef, data: bike)
{
    return updateDoc(bikeRef, data)
}


/**
 * Parses strava api gear to strava bike object
 * @param gearData gear object retrieved from Strava api
 * @returns strava bike object
 */
function gearDataToBikeDoc(gearData):stravaBike
{
    let stravaBikeTypesMapping  ={
        1: {
            "value": "mtb",
            "label": "Mountain bike"
        },
        3: {
            "value": 'road',
            "label": "Road bike"
        },
        5: {
            "value": "gravel",
            "label": "Gravel bike"
        }
    }
    let other = {
        "value": "other",
        "label" : "Other type bike"

    }
    let bike :stravaBike = {
        brand: gearData.brand_name,
        model: gearData.model_name,
        name: gearData.name,
        purchaseDate: new Date(0),
        state: gearData.retired ? "retired" : "active",
        type: stravaBikeTypesMapping[gearData.frame_type] !== undefined ? stravaBikeTypesMapping[gearData.frame_type] :  other,
        user: doc(getFirestore(firebaseApp), "users", getAuth(firebaseApp).currentUser.uid),
        stravaSynced: true,
        stravaId: gearData.id,
    }
    return bike
}

/**
 * Synchronizes bikes in database with bikes retrieved from Strava api
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns synchronization Promise
 */
async function syncBikes(User, setUser)
{
    let syncedBikes = (await getAllStravaSyncedBikes()).docs
    let stravaBikes =  await getAllBikes(User, setUser)
    
    let promises = stravaBikes.map(async stravaBike => {
        let gearData = await getStravaGear(stravaBike["id"], User, setUser)
        let syncedBike = syncedBikes.find(bike => bike.data().stravaId && bike.data().stravaId == gearData.id);
        //check if bike from strava is in db
        if(syncedBike)
        {
            updateBike(syncedBike.ref, gearDataToBikeDoc(gearData))
        }
        else
        {
            let bikeDocData: stravaBike = {
                ...gearDataToBikeDoc(gearData),
                rideDistance : 0,
                rideTime : 0,
                initialRideDistance: 0,
                initialRideTime: 0
            }
            addBike(bikeDocData)
        }
    })
    await Promise.all(promises)
    
    //delete bikes, which are no longer in strava account
    let bikeRetirePromises = syncedBikes.map(async syncedBike => {
        if(!(stravaBikes.some(stravaBike => stravaBike.id == syncedBike.data().stravaId)))
        {
            deactivateBike(syncedBike.id, "retired")
        }
    })
    return Promise.all(bikeRetirePromises)
}
/**
 * Parse ride from strava api to stravaRide object
 * @param activity activity retrieved from strava API
 * @returns stravaRide object
 */
function stravaActivityToRide(activity) : stravaRide
{
    let ride : stravaRide = {
        date: new Date(Date.parse(activity.start_date)),
        distance:activity.distance,
        rideTime:activity.moving_time,
        name:activity.name,
        user: doc(getFirestore(firebaseApp), "users", getAuth(firebaseApp).currentUser.uid),
        avgSpeed: (activity.average_speed)*3.6, //mps to kmh
        maxSpeed: (activity.max_speed)*3.6,
        elapsedTime: activity.elapsed_time,
        elevationGain: activity.total_elevation_gain,
        stravaSynced:true,
        stravaId: activity.id,
        bike: null    
    }
    return ride    
}

/**
 * Updates ride and recalculates mileage and ride time of components and bikes related with ride
 * @param oldRideData An object with old ride data
 * @param newRideData An object with new ride data
 * @param rideId ID of ride to update
 */
export async function updateRide(oldRideData: ride, newRideData: ride, rideId)
{
    if(oldRideData.bike != newRideData.bike && newRideData.bike)
    {
        let bikeDoc : any= ((await getDoc(newRideData.bike)).data())
        if(bikeDoc.purchaseDate.toDate() > newRideData.date)
        {
            throw new Error("Can not assing bike which has later purchase date than ride date")
        }
    }

    await updateDoc(doc(getFirestore(firebaseApp), "rides", rideId), {...newRideData})
    //bike ref updated
    
    //same bike
    if((!oldRideData.bike && !newRideData.bike) || (oldRideData.bike && newRideData.bike && oldRideData.bike.id == newRideData.bike.id))
    {
        if(newRideData.bike)
        {
            await updateBikeAndComponentsStatsAtDate(oldRideData.date,-1*oldRideData.distance, -1*oldRideData.rideTime, oldRideData.bike)
            await updateBikeAndComponentsStatsAtDate(newRideData.date,newRideData.distance, newRideData.rideTime, newRideData.bike)

        }
    }
    else //different bike
    {
        if(oldRideData.bike)
        {
            updateBikeAndComponentsStatsAtDate(oldRideData.date,-1* oldRideData.distance,-1* oldRideData.rideTime, oldRideData.bike)
        }
        if(newRideData.bike)
        {
           
            updateBikeAndComponentsStatsAtDate(newRideData.date,newRideData.distance, newRideData.rideTime, newRideData.bike)
        }
    }
}


/**
 * Synchronizes rides in database with rides retrieved from Strava api
 * @param User React context user state object
 * @param setUser react context user state setter function
 * @returns Rides synchronization promise
 */
async function syncRides(User, setUser)
{

    let syncedRides = (await getAllStravaSyncedRides()).docs 
    let stravaRides = await getAllStravaRides(User, setUser)

    
    let promises = stravaRides.map(async stravaRide => {
        
        let syncedRide = syncedRides.find(ride => ride.data().stravaId && ride.data().stravaId == stravaRide.id);
        //check if ride from strava is in DB
        if(syncedRide)
        {
            let newRide: stravaRide = await stravaActivityToRide(stravaRide)
            let oldRide = syncedRide.data() as stravaRide
            if(!oldRide.bike)
            {
                oldRide.bike = null
            }
            if(stravaRide.gear_id != null)
            {
                newRide.bike = (await getDocs(query(collection(getFirestore(firebaseApp), "bikes"), 
                    where("stravaId", "==", stravaRide.gear_id), 
                    where("user", "==", doc(getFirestore(firebaseApp), "users", getAuth().currentUser.uid))))).docs[0].ref
            }
            //update ride if some property has changed
            if(oldRide.distance != newRide.distance || 
                oldRide.name != newRide.name || 
                (oldRide.bike == null && newRide.bike !=null || oldRide.bike != null && newRide.bike == null || oldRide.bike != null && newRide.bike != null && oldRide.bike.id != newRide.bike.id))
            {
                await updateRide(oldRide, newRide, syncedRide.id)
            }
        }
        else
        {
            let ride: stravaRide = await stravaActivityToRide(stravaRide)
            if(stravaRide.gear_id != null)
            {
                ride.bike = (await getDocs(query(collection(getFirestore(firebaseApp), "bikes"), 
                    where("stravaId", "==", stravaRide.gear_id), 
                    where("user", "==", doc(getFirestore(firebaseApp), "users", getAuth().currentUser.uid))))).docs[0].ref
            }
            await addRide(ride)
        }
    } )
    await Promise.all(promises)
    //delete rides, which are in db but not in Strava anymore
    let rideDeletePromises = syncedRides.map(async syncedRide => {
        if(!(stravaRides.some(stravaRide => stravaRide.id == syncedRide.data().stravaId)))
        {
            deleteRide(syncedRide.id)
        }
    })
    return Promise.all(rideDeletePromises)
}

/**
 * calls bikes and rides synchronization
 * @param User React context user state object
 * @param setUser react context user state setter function
 */
export async function syncDataWithStrava(User, setUser: Function)
{
    await syncBikes(User, setUser)
    await syncRides(User, setUser)
}



/**
 * 
 * @param data Object with new bike data
 * @returns bike add doc promise
 */
export async function addBike(data: bike)
{
    return addDoc(collection(getFirestore(firebaseApp), "bikes"), data)
}


/**
 * Delete component and component swap records
 * @param componentId id of component to delete
 * @returns promise
 */
export async function deleteComponent(componentId)
{
    let componentSwapRecords = await getDocs(query(collection(getFirestore(firebaseApp), "bikesComponents"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))
    let deleteSwapsPromises = componentSwapRecords.docs.map(async record => deleteDoc(record.ref))
    let deleteCompPromise = deleteDoc(doc(getFirestore(firebaseApp), "components", componentId))
    return Promise.all([deleteSwapsPromises, deleteCompPromise])
    
} 
/**
 * Changes component state
 * @param componentId id of component to change state
 * @param newState new state of component
 * @returns update doc promise
 */
export async function changeComponentState(componentId, newState)
{
    return updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
        state: newState
    })
} 

/**
 * change component state to retired and uninstall from bike if installed on any 
 * @param componentId id of component to set as retired
 */
export async function retireComponent(componentId)
{
    let componentToDelete = await getDoc(doc(getFirestore(firebaseApp), "components", componentId))
    await changeComponentState(componentToDelete.id, "retired")
    if(componentToDelete.data().bike)
    {
        await uninstallComponent(componentToDelete.data().bike.id, componentToDelete.id)
    }
}

/**
 * change bike state 
 * @param bikeId id of bike to change state
 * @param newState new state of bike
 * @returns update doc promise
 */
export async function changeBikeState(bikeId, newState)
{
    return updateDoc(doc(getFirestore(firebaseApp), "bikes", bikeId), {
        state: newState
    })
} 
/**
 * sets bike to new state and uninstalls all components from it
 * @param bikeId id of bike to deactivate
 * @param newState new state of bike
 * @returns promise
 */
export async function deactivateBike(bikeId, newState)
{
    let changeStatePromise = changeBikeState(bikeId, newState)
    let installedComponents =await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("bike", "==", doc(getFirestore(firebaseApp), "bikes", bikeId))))
    //uninstall all components from bike
    let promises = installedComponents.docs.map( async component => {
        uninstallComponent(bikeId, component.id)
    })
    return Promise.all([changeStatePromise , promises])
}


/**
 * 
 * @param date date to find installed components for
 * @param bikeDocRef firestore document reference to bike 
 * @returns array of ids of components, which were installed on bike at specific date
 */
async function getInstalledComponentsAtDate(date, bikeDocRef)
{    
    let swapsBeforeRideQuery = await getDocs(query(collection(getFirestore(firebaseApp), "bikesComponents"),where("bike", "==", bikeDocRef), where("installTime", "<", date)))
    let swapsBeforeRide = []

    //copy data to array
    swapsBeforeRideQuery.docs.forEach(rec => {
        swapsBeforeRide.push(rec.data())
    })

    //get components docs
    const promises = swapsBeforeRide.map(async swapRecord => {
        swapRecord.component = (await getDoc(swapRecord.component))
    })
    await Promise.all(promises)

    let installedComponents = {}
    //filter components, which were installed at rideDate date and time
    swapsBeforeRide.forEach(record =>{
        let componentId = record.component.id
        if(componentId  in installedComponents )
        {
            if(record.installTime.toDate()  > installedComponents[componentId].installTime.toDate())
            {
                installedComponents[componentId] = record
            }
        }
        else
        {   
            if(!record.uninstallTime || record.uninstallTime.toDate() > date)
            {
                installedComponents[componentId] = record
            }
        }
    })
    return Object.keys(installedComponents)
}
/**
 * Increments mileage and ride time of components by given values (can be negative number too)
 * @param distance distance in meters to add
 * @param rideTime ride time in seconds to add
 * @param componentRef component doc reference to add stats to
 */
export async function incrementComponentDistanceAndTime(distance, rideTime, componentRef)
{
    updateDoc(componentRef, {
        "rideDistance": increment(distance),
        "rideTime": increment(rideTime)
    })
}

/**
 * Increments mileage and ride time of bike by given values (can be negative number too)
 * @param distance  distance in meters to add
 * @param rideTime  ride time in seconds to add
 * @param bikeRef bike doc reference to add stats to
 * @returns 
 */
async function incrementBikeStats(distance, rideTime, bikeRef)
{
    return updateDoc(bikeRef, {
        "rideDistance": increment(distance),
        "rideTime": increment(rideTime)
    })
}



async function incrementServiceStats(distance, rideTime, serviceRecordRef)
{
    return updateDoc(serviceRecordRef, {
        "rideDistance": increment(distance),
        "rideTime": increment(rideTime)
    })
}

async function incrementWearRecordStats(distance, rideTime, serviceRecordRef)
{
    return updateDoc(serviceRecordRef, {
        "rideDistance": increment(distance),
        "rideTime": increment(rideTime)
    })
}

/**
 * filters components, which were installed on bike at given date and updates their stats by incrementing rideTime and distance 
 * @param date date to check installed components for
 * @param distance distance in meters to add
 * @param rideTime ride time in seconds to add
 * @param bikeRef reference to bike doc
 * @returns promise
 */
export async function updateBikeAndComponentsStatsAtDate(date, distance, rideTime, bikeRef)
{
    incrementBikeStats(distance, rideTime,bikeRef)
    let installedComponents =await getInstalledComponentsAtDate(date, bikeRef)
    const componentsEditPromises = installedComponents.map(async installedComponent => {
        let componentRef = await doc(getFirestore(firebaseApp), "components", installedComponent)
        

        await  incrementComponentDistanceAndTime(distance, rideTime, componentRef)

        //update wear records and services stats, which were added after date of component stats update => need to recalculate ridetime and mileage of records
        let servicesToUpdate = await getDocs(query(collection(getFirestore(firebaseApp), "componentServiceRecords"),where("component", "==", componentRef), where("date", ">=", date)))
        let wearRecordsToUpdate = await getDocs(query(collection(getFirestore(firebaseApp), "componentWearRecords"),where("component", "==", componentRef), where("date", ">=", date)))
        
        servicesToUpdate.forEach(service => incrementServiceStats(distance, rideTime, service.ref))
        wearRecordsToUpdate.forEach(wearRecord => incrementServiceStats(distance, rideTime, wearRecord.ref))


        
    })

    return Promise.all([componentsEditPromises])    
}

/**
 * add new ride and update components and bikes stats
 * @param data ride data
 * @returns promise
 */
export async function addRide(data: ride)
{

    if(data.bike)
    {
        let bikeDoc : any= ((await getDoc(data.bike)).data())
        if(bikeDoc.purchaseDate.toDate() > data.date)
        {
            throw new Error("Can not assing bike which has later purchase date than ride date")
        }
    }
    let addRidePromise = addDoc(collection(getFirestore(firebaseApp), "rides"), data)
    if(data.bike)
    {  
        let updateStatsPromise = updateBikeAndComponentsStatsAtDate(data.date, data.distance, data.rideTime, data.bike)
        return Promise.all([addRidePromise, updateStatsPromise])
    }
    else
    {
        return addRidePromise
    }
}
/**
 * Delete ride and update components and bikes stats
 * @param rideId id of ride to delete
 * @returns promise
 */
export async function deleteRide(rideId)
{
    let rideToDelete = await getDoc(doc(getFirestore(firebaseApp), "rides", rideId))
    if(rideToDelete.data().bike)
    {
        
        let deletePromise = deleteDoc(rideToDelete.ref)
        
        let updateStatsPromise = updateBikeAndComponentsStatsAtDate(rideToDelete.data().date.toDate(), -1*rideToDelete.data().distance, -1*rideToDelete.data().rideTime, rideToDelete.data().bike)
        return Promise.all([updateStatsPromise, deletePromise])
    }
    else
    {
        return deleteDoc(rideToDelete.ref)
    }


}


/**
 * Uninstall component from bike and update bike and components state based on time of uninstallation
 * @param bikeId id of bike to uninstall component from
 * @param componentId id of component to uninstall
 * @param uninstallTime time to uninstall component at. default value is current time
 * @returns promise
 */
export async function uninstallComponent(bikeId, componentId, uninstallTime: Date = new Date()) {
  
    let bikeRef = doc(getFirestore(firebaseApp), "bikes", bikeId)
    let componentRef = doc(getFirestore(firebaseApp), "components", componentId)
    let newestSwapRecordDoc = (await getDocs(
        query(
            collection(getFirestore(firebaseApp), "bikesComponents"),
            where("component", "==", componentRef),
            orderBy("installTime", "desc")))).docs[0]


        if (uninstallTime > new Date()) {
            throw new Error("Uninstall time can't be in future")
        }
        if (uninstallTime < newestSwapRecordDoc.data().installTime) {
            throw new Error("Uninstallation of component must be later than installation ")
        }
    
        
        let addUninstallTime = updateDoc(newestSwapRecordDoc.ref, {
            uninstallTime: uninstallTime
        })
        let removeBikeRef = updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
            bike: deleteField()
        })
        let decrementKmAndHours = UpdateComponentsStats(uninstallTime, new Date(), bikeRef, componentRef, -1)
        return Promise.all([addUninstallTime, removeBikeRef, decrementKmAndHours])
}


/**
 * increments stats (km and ride time) of component, computed from ridden km and hours on certain bike between 2 dates 
 * @param startDate start date of interval
 * @param endDate end date of interval
 * @param bikeRef reference to bike to count ridden km of
 * @param componentRef component reference to update stats of
 * @param multiplyConstant number to multiply mileage and ride time with (can be used to decrement stats instead of incrementing)
 * @returns update doc promise
 */
export async function UpdateComponentsStats(startDate:Date, endDate:Date, bikeRef, componentRef, multiplyConstant = 1) {
    let rides = await getDocs(query(collection(getFirestore(firebaseApp), "rides"),
        where("bike", "==", bikeRef),
        where("date", ">=", startDate),
        where("date", "<=", endDate)))

    let ridesArray = []
    rides.forEach(ride => ridesArray.push(ride.data()))

    let kmTotal = ridesArray.reduce((ride1, ride2) => ride1 + (ride2["distance"] || 0), 0)
    let rideTimeTotal = ridesArray.reduce((ride1, ride2) => ride1 + (ride2["rideTime"] || 0), 0)

    return updateDoc(componentRef, {
        rideDistance: increment(multiplyConstant * kmTotal),
        rideTime: increment(multiplyConstant * rideTimeTotal)
    })
}


/**
 * Install component to bike and update its stats
 * @param componentId id of component to install
 * @param bikeId id of bike to install component to
 * @param installTime installation time, default is current time
 * @returns promise
 */
export async function installComponent(componentId, bikeId, installTime: Date, installationNote?: string) {

    let componentSwaps = await getDocs(
      query(collection(getFirestore(firebaseApp), "bikesComponents"),
        where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))
  
    let correctInstallDate = componentSwaps.docs.every((value) => {
      return value.data().uninstallTime.toDate() < installTime
    })
  
    if (correctInstallDate) {
      let bikeDoc = (await getDoc(doc(getFirestore(firebaseApp), "bikes", bikeId)))
      if (installTime > new Date()) {
        throw new Error("Installation time can not be set in future")
      }
      else if (installTime < bikeDoc.data().purchaseDate.toDate()) {
        throw new Error("Installation time can not be earlier than bike purchase date")
      }
      else {
  
        let componentRef = doc(getFirestore(firebaseApp), "components", componentId)
        //add swap record
        await  addDoc(collection(getFirestore(firebaseApp), "bikesComponents"), {
          bike: bikeDoc.ref,
          component: componentRef,
          installTime: installTime,
          installationNote: installationNote
        })
        //update component bike ref
        await updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
          bike: doc(getFirestore(firebaseApp), "bikes", bikeId)
        })
        return UpdateComponentsStats(installTime, new Date(), bikeDoc.ref, componentRef)
      }
    }
    else {
      throw new Error("Component installations can't overlap")
    }
  }
/**
 * @param bikeId id of bike
 * @returns promise
 */
export async function getBike(bikeId)
{
    return getDoc(doc(getFirestore(firebaseApp), "bikes", bikeId))
}

/**
 * 
 * @param componentId  id of component
 * @returns componentDoc
 */
export async function getComponent(componentId)
{
    return getDoc(doc(getFirestore(firebaseApp), "components", componentId))
}

/**
 * add new component
 * @param data component data
 * @returns promise
 */
export async function addComponent(data)
{
    return addDoc(collection(getFirestore(firebaseApp), "components"), data)
}
/**
 * Updates component
 * @param componentRef component doc ref
 * @param data new component data
 * @returns promise
 */
export async function updateComponent(componentRef, data)
{
    return updateDoc(componentRef, data)
}
/**
 * 
 * @param rideId id of ride
 * @returns ride doc promise
 */
export async function getRide(rideId)
{
    return getDoc(doc(getFirestore(firebaseApp), "rides", rideId))
}
/**
 * Deletes wear record and image from cloud, if its linked to record
 * @param wearRecordId id of wear record
 * @returns delete promise
 */
export async function deleteWearRecord(wearRecordId)
{
    let wearRecord = await getDoc(doc(getFirestore(firebaseApp), "componentWearRecords", wearRecordId))
    if(wearRecord.data().image)
    {
      return deleteObject(ref(getStorage(firebaseApp), wearRecord.data().image)).then(() => {
        deleteDoc(wearRecord.ref)
      })
    }
    else
    {
      return deleteDoc(wearRecord.ref)
    }
}
/**
 * Delete component installation record and update bike and components stats
 * @param componentSwapRecordId id of installation record to delete
 * @returns promise
 */
export async function deleteComponentSwapRecord(componentSwapRecordId)
{
    let componentSwapRecord = await getDoc(doc(getFirestore(firebaseApp), "bikesComponents", componentSwapRecordId))
    if (!componentSwapRecord.data().uninstallTime) {
        updateDoc(componentSwapRecord.data().component, {
            bike: deleteField()
        })
    }
   

    let deleteRecord = deleteDoc(componentSwapRecord.ref)
    let removeKmAndHours = UpdateComponentsStats(componentSwapRecord.data().installTime, componentSwapRecord.data().uninstallTime ? componentSwapRecord.data().uninstallTime : new Date(),
        doc(getFirestore(firebaseApp), "bikes", componentSwapRecord.data().bike.id), doc(getFirestore(firebaseApp), "components", componentSwapRecord.data().component.id), -1)
    return Promise.all([deleteRecord, removeKmAndHours])
}
/**
 * add strava account info to firestore doc in users collection 
 * @param tokens object with strava api tokens
 * @param user user to add data to
 */
export async function connectAccWithStrava(tokens, user) {
    updateDoc(doc(getFirestore(firebaseApp), "users", user.uid),
      {
        stravaConnected: true,
        stravaInfo: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          accessTokenExpiration: new Date((tokens.issuedAt + tokens.expiresIn)*1000)
        }
      })
  }

/**
 * 
 * @param userId id of user owning bikes
 * @returns users active bikes
 */
export async function getUsersActiveBikes(userId)
{
    return getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("user", "==", doc(getFirestore(firebaseApp), "users", userId)), where("state","==", "active")))
}


/**
 * sets users firestore document to userData
 * @param userId id of user
 * @param userData new user data
 * @returns setdoc promise
 */
export async function saveUserData(userId, userData) {
    return setDoc(doc(getFirestore(firebaseApp), "users", userId), userData);
}


