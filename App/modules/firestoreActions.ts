

import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc, deleteField, increment, addDoc, orderBy, DocumentReference, Firestore } from 'firebase/firestore';
import { getAllBikes, getStravaGear, getAllActivities } from './stravaApi';
import { getAuth } from 'firebase/auth';

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
    purchaseDate: Date,
    rideDistance: number,
    rideTime: number,
    initialRideDistance: number,
    initialRideTime: number,
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


export async function getAllStravaSyncedRides()
{
    let authUser = getAuth(firebaseApp)
    return getDocs(query(collection(getFirestore(firebaseApp), "rides"), where("stravaSynced", "==", true), where("user", "==", doc(getFirestore(firebaseApp), "users", authUser.currentUser.uid))))
}
export async function getAllStravaRides(User, setUser)
{
    let activities = (await getAllActivities(User, setUser))
    return activities.filter(activity => activity.type == "Ride")
}

export async function updateUserStravaTokens(stravaInfo)
{
    return updateDoc(doc(getFirestore(firebaseApp), "users", getAuth().currentUser.uid), 
    {
        "stravaInfo": stravaInfo
    })
}

export async function getLoggedUserData()
{
    return (await getDoc(doc(getFirestore(firebaseApp), "users", getAuth().currentUser.uid))).data()
}


export async function getAllStravaSyncedBikes()
{
    let authUser = getAuth(firebaseApp)
    return getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("stravaSynced", "==", true), where("user", "==", doc(getFirestore(firebaseApp), "users", authUser.currentUser.uid))))
}


export async function updateBike(bikeRef, data: bike)
{
    return updateDoc(bikeRef, data)
}


function gearDataToBikeDoc(gearData):stravaBike
{

    let stravaBikeTypesMapping  ={
        1: {
            "value": "mtbfull",
            "label": "MTB full suspension"
        }
    }
    let bike :stravaBike = {
        brand: gearData.brand_name,
        model: gearData.model_name,
        name: gearData.name,
        purchaseDate: new Date(0),
        state: gearData.retired ? "retired" : "active",
        type: stravaBikeTypesMapping[gearData.frame_type],
        user: doc(getFirestore(firebaseApp), "users", getAuth(firebaseApp).currentUser.uid),
        stravaSynced: true,
        stravaId: gearData.id,
        rideDistance: 0,
        rideTime: 0,
        initialRideDistance: 0,
        initialRideTime: 0
    }
    return bike
}


async function syncBikes(User, setUser)
{
    let syncedBikes = (await getAllStravaSyncedBikes()).docs
    let stravaBikes =  await getAllBikes(User, setUser)
    for(let i = 0;i<stravaBikes.length;i++)
    {
        let gearData = await getStravaGear(stravaBikes[i]["id"], User, setUser)
        //exists in both, update data except rideTime and distance
        let syncedBike = syncedBikes.find(bike => bike.data().stravaId && bike.data().stravaId == gearData.id);
        if(syncedBike)
        {
            updateBike(syncedBike.ref, gearDataToBikeDoc(gearData))
            //remove bike from list
            syncedBikes = syncedBikes.filter(bike => bike.data().stravaId != gearData.id)
        }
        else //bike exists in strava, does not exist in db
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
    }
    
    //delete bikes, which are no longer in strava account
    for(let i = 0;i<syncedBikes.length;i++)
    {
        deleteDoc(syncedBikes[i].ref)
    }
}

function stravaActivityToRide(activity) : stravaRide
{
    let ride : stravaRide = {
        date: new Date(Date.parse(activity.start_date_local)),
        distance:activity.distance,
        rideTime:activity.moving_time,
        name:activity.name,
        user: doc(getFirestore(firebaseApp), "users", getAuth(firebaseApp).currentUser.uid),
        avgSpeed: activity.average_speed,
        maxSpeed: activity.max_speed,
        elapsedTime: activity.elapsed_time,
        elevationGain: activity.total_elevation_gain,
        stravaSynced:true,
        stravaId: activity.id,
        bike: null    
    }
    return ride    
}

export async function updateRide(oldRideData: any, newRideData: ride, rideId)
{
    updateDoc(doc(getFirestore(firebaseApp), "rides", rideId), {...newRideData})
    //bike ref updated
    if(oldRideData.bike != newRideData.bike)
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
    else
    {   
        if(newRideData.bike)
        {
            updateBikeAndComponentsStatsAtDate(newRideData.date,newRideData.distance-oldRideData.distance, newRideData.rideTime-oldRideData.rideTime, newRideData.bike)
        }
    }
}



async function syncRides(User, setUser)
{

    console.log("syncing rides")
    let syncedRides = (await getAllStravaSyncedRides()).docs 
    let stravaRides = await getAllStravaRides(User, setUser)

    console.log("syncing " + stravaRides.length + " rides")
    for(let i = 0;i<stravaRides.length;i++)
    {
        let syncedRide = syncedRides.find(ride => ride.data().stravaId && ride.data().stravaId == stravaRides[i].id);
        if(syncedRide)
        {
            let newRide: stravaRide = await stravaActivityToRide(stravaRides[i])
            let oldRide = syncedRide.data()
            if(!oldRide.bike)
            {
                oldRide.bike = null
            }
            if(stravaRides[i].gear_id != null)
            {
                newRide.bike = (await getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("stravaId", "==", stravaRides[i].gear_id)))).docs[0].ref
            }
            

            //gear id
            if(oldRide.distance != newRide.distance || 
                oldRide.name != newRide.name || 
                (oldRide.bike == null && newRide.bike !=null || oldRide.bike != null && newRide.bike == null || oldRide.bike != null && newRide.bike != null && oldRide.bike.id != newRide.bike.id))
            {
                console.log("update ride")
                await updateRide(oldRide, newRide, syncedRide.id)
                console.log("updated")
            }
            else
            {

                console.log("exists, dont update")
            }
        //     //is in db, udpate, if km and ride hours are different - update components
        //     syncedRides = syncedRides.filter(ride => ride.id !=stravaRides[i].id)
        //     //remove from synced rides
        }
        else
        {
            console.log("adding")
            let ride: stravaRide = await stravaActivityToRide(stravaRides[i])
            if(stravaRides[i].gear_id != null)
            {
                ride.bike = (await getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("stravaId", "==", stravaRides[i].gear_id)))).docs[0].ref
            }
            await addRide(ride)
        //     //not in DB, add to db and add kms to components
        }
    }
    console.log("remove not existing")
    //remove non existing, remove km from components
    // for(let i = 0;i<syncedRides.length;i++)
    // {
    //         deleteRide(syncedRides[i].id)
    // }
}

export async function syncDataWithStrava(User, setUser: Function)
{
    await syncBikes(User, setUser)
    await syncRides(User, setUser)
}




export async function addBike(data: bike)
{
    return addDoc(collection(getFirestore(firebaseApp), "bikes"), data)
}

export async function deleteComponent(componentId)
{
    return deleteDoc(doc(getFirestore(firebaseApp), "components", componentId))
} 

export async function retireComponent(componentId)
{
    return updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
        state: "retired"
    })
} 

export async function retireBike(bikeId)
{
    return updateDoc(doc(getFirestore(firebaseApp), "bikes", bikeId), {
        state: "retired"
    })
} 

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
            if(!record.uninstallTime || record.component.data().uninstallTime > date)
            {
                installedComponents[componentId] = record
            }
        }
    })
    return Object.keys(installedComponents)
}

export async function incrementComponentDistanceAndTime(distance, rideTime, componentRef)
{
    updateDoc(componentRef, {
        "rideDistance": increment(distance),
        "rideTime": increment(rideTime)
    })
}


async function incrementBikeStats(distance, rideTime, bikeRef)
{
    return updateDoc(bikeRef, {
        "rideDistance": increment(distance),
        "rideTime": increment(rideTime)
    })
}

//filters components, which were installed at given date and updates their stats by incrementing rideTime and distance
export async function updateBikeAndComponentsStatsAtDate(date, distance, rideTime, bikeRef)
{
    incrementBikeStats(distance, rideTime,bikeRef)
    let installedComponents =await  getInstalledComponentsAtDate(date, bikeRef)
    
    const componentsEditPromises = installedComponents.map(async installedComponent => {
        let componentRef = doc(getFirestore(firebaseApp), "components", installedComponent)
        return incrementComponentDistanceAndTime(distance, rideTime, componentRef)
    })

    return Promise.all([componentsEditPromises])    
}
export async function addRide(data)
{
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

export async function deleteRide(rideId)
{
    //UDELANA ZMENA, checknout jestli to jede
    let rideToDelete = await getDoc(doc(getFirestore(firebaseApp), "rides", rideId))
    if(rideToDelete.data().bike)
    {
        
        let deletePromise = deleteDoc(rideToDelete.ref)
        
        let updateStatsPromise = updateBikeAndComponentsStatsAtDate(rideToDelete.data().date.toDate(), -1*rideToDelete.data().distance, -1*rideToDelete.data().rideTime, rideToDelete.data().bike)
        // let installedComponents =await  getInstalledComponentsAtDate(rideToDelete.data().date.toDate(), rideToDelete.data().bike)
        
        // incrementBikeStats(-1 * rideToDelete.data().distance,-1 *  rideToDelete.data().rideTime,rideToDelete.data().bike)
        // const promises = installedComponents.map(async installedComponent => {
        //     let componentRef = doc(getFirestore(firebaseApp), "components", installedComponent)
        //     return incrementComponentDistanceAndTime(-1 * (rideToDelete.data().distance), -1 * rideToDelete.data().rideTime, componentRef)
        // })
        return Promise.all([updateStatsPromise, deletePromise])
    }
    else
    {
        return deleteDoc(rideToDelete.ref)
    }


}


export async function uninstallComponent(bikeId, componentId, uninstallTime: Date) {

    let bikeRef = doc(getFirestore(firebaseApp), "bikes", bikeId)
    let componentRef = doc(getFirestore(firebaseApp), "components", componentId)
    let newestSwapRecordDoc = (await getDocs(
        query(
            collection(getFirestore(firebaseApp), "bikesComponents"),
            where("bike", "==", bikeRef),
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

    Promise.all([addUninstallTime, removeBikeRef, decrementKmAndHours])
}

//increments stats (km and ride time) of component, computed from ridden km and hours on bike between 2 dates
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



export async function installComponent(componentId, bikeId, installTime: Date) {

    let componentSwaps = await getDocs(
      query(collection(getFirestore(firebaseApp), "bikesComponents"),
        where("bike", "==", doc(getFirestore(firebaseApp), "bikes", bikeId)),
        where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))
  
    let correctInstallDate = componentSwaps.docs.every((value) => {
      return value.data().uninstallTime.seconds < Math.round(installTime.getTime() / 1000)
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
          installTime: installTime
        })
        //update component bike ref
        await updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
          bike: doc(getFirestore(firebaseApp), "bikes", bikeId)
        })
        return UpdateComponentsStats(installTime, new Date(), bikeDoc.ref, componentRef)
      }
    }
    else {
      throw new Error("You can not set installation time, which is earlier than existing component installation record")
    }
  }

export async function getBike(bikeId)
{
    return getDoc(doc(getFirestore(firebaseApp), "bikes", bikeId))
}

export async function getComponent(componentId)
{
    return getDoc(doc(getFirestore(firebaseApp), "components", componentId))
}

//interface component
export async function addComponent(data)
{
    return addDoc(collection(getFirestore(firebaseApp), "components"), data)
}

export async function updateComponent(componentRef, data)
{
    return updateDoc(componentRef, data)
}

export async function getRide(rideId)
{
    return getDoc(doc(getFirestore(firebaseApp), "rides", rideId))
}