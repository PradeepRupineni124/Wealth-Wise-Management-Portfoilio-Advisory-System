import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import {ToastModule} from 'primeng/toast';
// import { Registration } from "./registration/registration";
import { Registration } from "./Authentication/registration.component/registration.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PasswordModule, InputTextModule, ButtonModule, ReactiveFormsModule, Registration],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my_frontend');
}
