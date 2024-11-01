import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, FooterComponent, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  details: any = {};
  tax: number = 0;
  total: number = 0;
  subtotal: number = 0;
  loading: boolean = false;
  // declare type of transaction new, modify, cancel
  transaction_type: string = "";
  // only for modify
  difference: number = 0;
  positiveDifference: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private location: Location) { }

  paymentForm = new FormGroup({
    cardNum: new FormControl('', Validators.required),
    cardName: new FormControl('', Validators.required),
    expDate: new FormControl('', Validators.required),
    CVV: new FormControl('', Validators.required),
  });

  goBack(): void {
    this.location.back();
  }

  cancelSubmit(): void {
    this.loading = true;
    this.apiService.postBackendRequest('cancel-reservation', { 'reservationId': this.details['id'] })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loading = false;
          this.router.navigate(['/confirmation']);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        }
      });
  }

  modifySubmit(): void {
    if (this.paymentForm.invalid) {
      alert("invalid payment details");
    }
    else {
      this.loading = true;
      this.details['totalPrice'] = this.total;
      this.details['differencePaid'] = this.difference.toFixed(2);
      let reservationDetails = {
        "paymentDetails": this.paymentForm.value,
        "reservationDetails": this.details
      }
      this.apiService.postBackendRequest('modify-reservation', reservationDetails)
    .subscribe({
      next: (data: any) => {
        console.log(data);
        // TODO check fields
        this.router.navigate(['/confirmation']);
        this.loading = false;
      },
      error: (error: any) => {
        console.log(error);
        alert("Error modifying booking");
        this.loading = false;
      }
    }); 
    }
  }

  paymentSubmit(): void {
    // TODO make better alert message
    if (this.paymentForm.invalid) {
      alert("invalid payment details");
    }
    else {
      this.loading = true;
      this.details['totalPrice'] = this.total;
      let reservationDetails = {
        "paymentDetails": this.paymentForm.value,
        "reservationDetails": this.details
      }
      // TODO verify payment details
      console.log(reservationDetails);
      this.apiService.postBackendRequest('create-reservation', reservationDetails)
        .subscribe({
          next: (response) => {
            console.log("Payment Success");
            console.log(response['status']);
            console.log(response['message']);
            this.loading = false;
            this.router.navigate(['/confirmation']);
          },
          error: (error) => {
            console.error("Reservation Error");
            console.error(error);
            this.loading = false;
          }
        });
      }
  }

  calculateTax(): number {
    console.log("TAX IS: " + (+this.subtotal * 0.09).toFixed(2));
    return +(+this.subtotal * 0.09).toFixed(2);
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
      console.log("RECEIVED DETAILS" + JSON.stringify(this.details));
      this.transaction_type = params['type'];
    });

    this.subtotal = +this.details['price']*this.details['nights'];
    this.subtotal = +this.subtotal.toFixed(2);
    this.tax = this.calculateTax();
    this.total = this.calculateTotal();
    if (this.transaction_type == "modify") {
      this.difference = this.details['total_price'] - this.total;
      if (this.difference < 0) {
        this.positiveDifference = true;
      }
      this.difference = Math.abs(this.difference);
    }
  }
}