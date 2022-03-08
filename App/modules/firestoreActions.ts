

import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc, deleteField, increment, addDoc, orderBy } from 'firebase/firestore';



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
//TODO data interface
export async function addRide(data)
{
    let addRidePromise = addDoc(collection(getFirestore(firebaseApp), "rides"), data)
    
    incrementBikeStats(data.distance, data.rideTime,data.bike)
    let installedComponents =await  getInstalledComponentsAtDate(data.date, data.bike)
    
    const componentsEditPromises = installedComponents.map(async installedComponent => {
        let componentRef = doc(getFirestore(firebaseApp), "components", installedComponent)
        return incrementComponentDistanceAndTime(data.distance, data.rideTime, componentRef)
    })

    return Promise.all([componentsEditPromises, addRidePromise])    
}

export async function deleteRide(rideId)
{

    let rideToDelete = await getDoc(doc(getFirestore(firebaseApp), "rides", rideId))
    let installedComponents =await  getInstalledComponentsAtDate(rideToDelete.data().date.toDate(), rideToDelete.data().bike)
    
    incrementBikeStats(-1 * rideToDelete.data().distance,-1 *  rideToDelete.data().rideTime,rideToDelete.data().bike)
    const promises = installedComponents.map(async installedComponent => {
        let componentRef = doc(getFirestore(firebaseApp), "components", installedComponent)
        return incrementComponentDistanceAndTime(-1 * (rideToDelete.data().distance), -1 * rideToDelete.data().rideTime, componentRef)
    })

    let deletePromise = deleteDoc(rideToDelete.ref)
    return Promise.all([promises, deletePromise])

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
    console.log("zec")
    console.log(startDate.toLocaleString())
    console.log(endDate.toLocaleString())
    console.log("km: " + kmTotal)
    console.log("konec")

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