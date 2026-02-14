import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root',
})
export class PayloadService {
 RegisterPayload(registerFormValue: any) {
    return {
      fullName: registerFormValue.fullName, 
      email: btoa(registerFormValue.email),   
      password: btoa(registerFormValue.password) 
    };
  }

  LoginPayload(email: string, password: string) {
    return {
      email: btoa(email),       
      password: btoa(password)  
  }
}
}