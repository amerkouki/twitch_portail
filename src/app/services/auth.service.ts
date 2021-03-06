import { Injectable, NgZone } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { User } from '../modules/user';
import { FirebaseApp } from "@angular/fire"; 


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any; // Save logged in user data

  constructor(
   
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) { 
    this.afAuth.authState.subscribe(user=>{

      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
      
    });
  }


   // Sign in with email/password
   SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }


    // Sign up with email/password
   /* async SignUp(email, password) {
      return await this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          /* Call the SendVerificaitonMail() function when new user sign 
          up and returns promise */
         /* this.SendVerificationMail();
          this.SetUserData(result.user);
        }).catch((error) => {
          window.alert(error.message)
        })
    }*/




    async SignUp(
      email: string,
      password: string
    ): Promise<firebase.default.auth.UserCredential> {
      try {
        const newUserCredential: firebase.default.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
          email,
          password
        );
        await this.afs
          .doc(`userProfile/${newUserCredential.user.uid}`)
          .set({ email });
        /*
          Here we add the functionality to send the email.
        */
       await this.SetUserData(newUserCredential.user);
        await newUserCredential.user.sendEmailVerification();
     console.log('************************* '+ newUserCredential);
        return newUserCredential;
      } catch (error) {
        throw error;
      }
    }



 // Reset Forggot password
 ForgotPassword(passwordResetEmail) {
  return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
  .then(() => {
    window.alert('Password reset email sent, check your inbox.');
  }).catch((error) => {
    window.alert(error)
  })
}



  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }






 // Sign in with Google
 GoogleAuth() {

  //return this.AuthLogin(new FirebaseApp.GoogleAuthProvider());
}

// Auth logic to run auth providers
AuthLogin(provider) {
 /* return this.afAuth.auth.signInWithPopup(provider)
  .then((result) => {
     this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      })
    this.SetUserData(result.user);
  }).catch((error) => {
    window.alert(error)
  })*/
}

FacebookAuth(){}




     // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    
   /* return this.afAuth.defcurrentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email-address']);
    })*/
  }


  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

}
