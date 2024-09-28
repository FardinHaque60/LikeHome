import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, NgModule } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {LoginComponent} from '../login/login.component';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RegisterComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  loginService = inject(LoginComponent);

  ngOnInit(): void{
  }

}

