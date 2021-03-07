import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {HttpServiceService} from '../http-service.service';
import { error } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  public cartServiceEvent = new BehaviorSubject({});
  cartQty = 0;
  cartObj = [];
 public cartTotalPrice :any;

  constructor(private http:HttpServiceService) {

   this.getCartDetailsByUser(); 
   }

   getCartDetailsByUser(){
     this.http.postRequest("cart-service/cart/get-cart-by-user-id/1001",{}).subscribe((data:any)=>{
      //alert("Error while fetching the cart Details");
      console.log(data);
      this.cartObj = data;
      this.cartQty = data.length;
     this.cartTotalPrice = this.getTotalAmounOfTheCart();
      this.cartServiceEvent.next({"status":"completed"})//emitter
     },error=>{
       alert("Error while fetching the cart Details");
     })
   }


  addCart(obj){
    //this.cartServiceEvent.next({"status":"completed"})//emitter
    var request  = {
      "productId":obj.productId,
      "qty":obj.qty,
      
      "price":obj.price
    }
    this.http.postRequest("cart-service/cart/add-cart-by-productId-and-userId-quantity-price/"+obj.productId+"/"+obj.userId+"/"+obj.qty+"/"+obj.price+"",request).subscribe((data:any)=>{
      this.getCartDetailsByUser()
    },
    error=>{
      //if the products is already in cart
        alert("Error in AddCart API "+error.message);
    })
  }
  getCartOBj(){
    return this.cartObj;
  }
  getTotalAmounOfTheCart(){
    let obj = this.cartObj;
    let totalPrice  = 0;
   
    for(var o in obj ){      
      totalPrice = totalPrice +parseFloat(obj[o].price);
    }

    return totalPrice.toFixed(2);
  }
  getQty(){
    return this.cartQty;
  }


  removeCart(cartId){
      var request = {
          "productId":"dummy_val",
          "cartId":cartId,
      }
      this.http.postRequest("cart-service/cart/remove-cart-by-cartId/"+cartId+"",request).subscribe((data:any)=>{
          this.getCartDetailsByUser();
      },error=>{
        alert("Error while fetching the cart Details");
      })
  }
}
