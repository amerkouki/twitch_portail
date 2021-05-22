import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Stripe} from "../modules/stripe";
import {AuthService} from "../services/auth.service";
import {FirebaseService} from "../services/firebase.service";

@Component({selector: "app-dashboard", templateUrl: "./dashboard.component.html", styleUrls: ["./dashboard.component.css"]})
export class DashboardComponent implements OnInit {
  paymentHandler: any = null;
  token: any;
  constructor(public payer : FirebaseService, private auth : AuthService, private router : Router) {}

   ngOnInit() {
     this.invokeStripe();
  }

   makePayment(amount : any) {
    this.paymentHandler = (<any>window).StripeCheckout.configure({
        key: "pk_test_51IQHveIhmAFyeETacyxkmQW9HkjvmE8ddS8gjtimLQSqrwTV3wDUQXf7Dc0cFmhKyPmRWRLHJAbcaOIojgzH9q6P00BSypHSA6",
        locale: "auto"
      }); 

       this.test(amount ,(stripeToken)=>{
        const user = JSON.parse(localStorage.getItem('user'));

        //this.payer.SetStripeData(user,stripeToken);
        console.log("token open ... valid " + stripeToken.last4);
      }) 
      
      
    } 



      test(amount ,suc) {
         
      this.paymentHandler.open(
      {
      name:"kouki test",
      description:"description kouki",
      amount : amount * 100,
      email : 'koukii@gmail.com',
      token: function(stripeToken)
        {
        const user = JSON.parse(localStorage.getItem('user'));
        const stripe:Stripe={
            id_tok:stripeToken.id,
            id_user:user.uid,
            email : stripeToken.email,
            client_ip:stripeToken.client_ip,
            exp_month:stripeToken.card.exp_month,
            exp_year:stripeToken.card.exp_year,
            last4:stripeToken.card.last4,
            object:stripeToken.card.objet
        }
       
        suc(stripe);
        localStorage.setItem('token',JSON.stringify(stripe));
      }
    }
    );  
      }



      testFire(){
        this.payer.setUser();
      }

      invokeStripe() {
        if (!window.document.getElementById("stripe-script")) {
          const script = window.document.createElement("script");
          script.id = "stripe-script";
          script.type = "text/javascript";
          script.src = "https://checkout.stripe.com/checkout.js";
          window.document.body.appendChild(script);
        }
      }
      }
