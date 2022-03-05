

import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';



export async function deleteComponent(componentId)
{
    deleteDoc(doc(getFirestore(firebaseApp), "components", componentId))
} 


export async function deleteBike(bikeId)
{
    deleteDoc(doc(getFirestore(firebaseApp), "bikes", bikeId))
} 

export async function deleteRide(rideId)
{
    deleteDoc(doc(getFirestore(firebaseApp), "rides", rideId))
}