import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
})

export class RegisterComponent {
    
    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('',Validators.required),
        password: new FormControl('', Validators.required),
    });

    constructor(private router: Router){}

    formSubmit() {       
        this.router.navigate(['../home']);
    }
}