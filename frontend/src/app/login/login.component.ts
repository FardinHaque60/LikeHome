import { Component,Injectable, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
})


@Injectable({
    providedIn: 'root'
})
export class LoginComponent {

    isLoggedIn: boolean = false;

    constructor(private router: Router){}
  
    loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('',Validators.required),
    });

    loginSubmit() {
        this.isLoggedIn = true;
        this.router.navigate(['../home']);
    }
}
