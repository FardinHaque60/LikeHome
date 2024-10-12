import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, FooterComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  details: any = {};
  tax: number = 0;
  total: number = 0;
  subtotal: number = 0;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  paymentForm = new FormGroup({
    cardNum: new FormControl('', Validators.required),
    cardName: new FormControl('', Validators.required),
    expDate: new FormControl('', Validators.required),
    CVV: new FormControl('', Validators.required),
  });

  // TODO: send data from form to backend
  paymentSubmit(): void{
    
  }

  calculateTax(price: number): number {
    return +(this.subtotal * 0.09).toFixed(2);
  }

  calculateTotal(): number {
    return +(this.tax + this.subtotal).toFixed(2);
  }

  ngOnInit(): void {
    //moves to the top of the page when finished navigating (back&forth)
    //seems to not work with <-- back arrows
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
            window.scrollTo(0, 0)
        }
    });

    this.route.queryParams.subscribe(params => {
      this.details = JSON.parse(params['details']);
    });

    this.subtotal = +this.details['price']*this.details['nights'];
    this.tax = this.calculateTax(this.details['price']);
    this.total = this.calculateTotal();
  }

}