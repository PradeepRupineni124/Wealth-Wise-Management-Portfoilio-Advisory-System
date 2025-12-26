import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    valid_username:string='pradeeprupineni@gmail.com';
    valid_password:string='Pradeep@8977';
   
    validateData(username:string,password:string){
      if(this.valid_password==password && this.valid_username==username){
        return true;
      }
      else{
        return false;
      }
    }
}
