import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [RouterLink, RouterOutlet],
})

export class RegisterComponent {
    
    emailaddress = '';
    username = '';
    passowrd = '';
}