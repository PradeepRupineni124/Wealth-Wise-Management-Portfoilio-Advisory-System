import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    valid_username:string='admin@gmail.com';
    valid_password:string='admin@123';
   
    validateData(username:string,password:string){
      if(this.valid_password==password && this.valid_username==username){
        return true;
      }
      else{
        return false;
      }
    }
}
