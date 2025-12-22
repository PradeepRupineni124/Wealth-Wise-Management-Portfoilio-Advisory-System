import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [RouterModule,InputText, FloatLabel, Button, FormsModule,PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  values?:string;
  value?:string;


}
