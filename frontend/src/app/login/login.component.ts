import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
})

export class LoginComponent {
    
    loginForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
    });

    loginSubmit() {
        alert(this.loginForm.value.username + 
            ' ' + this.loginForm.value.password);
    }

}
