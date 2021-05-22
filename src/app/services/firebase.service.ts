import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { User } from '../modules/user';
import { FirebaseApp } from "@angular/fire"; 
import { Stripe } from '../modules/stripe';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
   
    public afs: AngularFirestore,   // Inject Firestore service
    //public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router
  ) { }



  getAllApiPayer(user){
    return this.afs.collection('apiPayer',
                                ref=>ref.limit(3)
                                .where('uid','==' ,user.uid)
    
    ).snapshotChanges();
  }


  SetStripeData(user,stripe) {

    return this.afs.collection('apiPayer').add({id: 'kouki'});
/*
    return this.afs.collection('apiPayer').doc(user.uid).set(stripe)
    .then((result)=>{ console.log('set DtataStripe avec succuss '+ result)})
    .catch((error)=>{console.log('error set Data stripe '+ error)})
    ;*/

    //return this.afs.doc(`apiPayer/${user.uid}`).set(user);
    //const userRef: AngularFirestoreDocument<any> = this.afs.doc(`apiPayer/${user.uid}`);
   // const stripeData: Stripe = stripe;
   console.log('******************** '+ stripe +'  user : '+user);
    /*return userRef.set(stripe, {
      merge: true
    })*/
  }

  setUser(){
    this.afs.collection('test').add({'name': 'test'});
  }
}