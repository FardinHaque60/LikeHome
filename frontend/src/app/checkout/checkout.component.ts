import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  rewardNightsOptions: Array<number> = [0];
  rewardsApplied: number = 0; // COST discounted from rewards (rate * nights requested)
  userRewards: number = 0; // initial user rewards
  userAfterRewards: number = 0; // user rewards after applying
  rewardsEarned: number = 0; // rewards earned from booking
  loading: boolean = false;
  conflict: boolean = false;
  // declare type of transaction new, modify, cancel
  transaction_type: string = "";
  // only for modify
  difference: number = 0;
  positiveDifference: boolean = false;
  modificationFee: number = 0;
  // only for cancel
  cancellationFee: number = 0;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private location: Location) { }

  expDateValidator: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    const expDate = form.get('expDate')?.value;
    // check format for MM/YY
    const expDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!expDatePattern.test(expDate)) {
      return { expDate: 'format' };
    }

    // check format for valid date
    const [month, year] = expDate.split('/').map(Number);

    const expDateObject = new Date(2000 + year, month - 1, 1);
    const now = new Date();
    now.setHours(0, 0, 0, 0); 

    if (expDateObject < now) {
      return { expDate: 'expired' }; 
    }

    return null;
  }

  paymentForm = new FormGroup({
    cardNum: new FormControl('', Validators.required),
    cardName: new FormControl('', Validators.required),
    expDate: new FormControl('', Validators.required),
    CVV: new FormControl('', Validators.required),
    rewardsNights: new FormControl(0, Validators.required),
  }, { validators: this.expDateValidator });

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
    if (this.paymentForm.invalid || this.conflict) {
      this.paymentForm.markAllAsTouched();
      console.log("Payment field Error");
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
    if (this.paymentForm.invalid || this.conflict) {
      this.paymentForm.markAllAsTouched();
      console.log("Payment field Error");
    }
    else {
      this.loading = true;
      this.details['totalPrice'] = this.total;
      this.details['newRewards'] = this.userAfterRewards;
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

  checkConflict(): void {
    let travelWindow = {
      "checkIn": this.details['checkIn'],
      "checkOut": this.details['checkOut'],
      "hotelName": this.details['hotel']
    }
    this.apiService.postBackendRequest('check-conflict', travelWindow)
    .subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
        this.conflict = true;
      }
    });
  }

  checkCancellationFee(): number {
    let checkIn = this.details['checkIn'];
    // convert check in to date obj
    const targetDate = new Date(checkIn);
    
    // Get the current date
    const currentDate = new Date();
    
    // Set the time to the start of the day for accurate comparison
    currentDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    // Calculate the date one week after the target date
    const oneWeekBefore = new Date(targetDate);
    oneWeekBefore.setDate(targetDate.getDate() - 7);
    
    // Check if the current date is within one week of the target date
    if (currentDate >= oneWeekBefore && currentDate <= targetDate) {
      return this.total * 0.4;
    }
    return 0;
  }

  updateRewards(): void {
    let nights = this.paymentForm.value.rewardsNights ? this.paymentForm.value.rewardsNights : 0;
    let rate = this.details['price'];
    let rewardsPerNight = Math.ceil(rate) * 5; // reward points needed per night

    this.rewardsApplied = rate * nights; // cost discounted by rewards (i.e. number of nights request * rate)
    this.userAfterRewards = this.userRewards + this.rewardsEarned - (rewardsPerNight * nights);
    this.total = this.subtotal + this.tax - this.rewardsApplied;
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
      console.log("TRANSACTION TYPE: " + this.transaction_type);
    });

    this.subtotal = +this.details['price']*this.details['nights'];
    this.subtotal = +this.subtotal.toFixed(2);
    this.tax = this.calculateTax();
    this.total = this.calculateTotal();

     // check if another booking is happening in same date window
     if (this.transaction_type === 'new') {
      this.checkConflict();
      this.rewardsEarned = Math.ceil(this.details['price']) * this.details['nights'];
      this.apiService.getBackendRequest('get-session')
        .subscribe({
          next: (data: any) => {
            console.log(data);
            // TODO init these fields with session
            this.userRewards = data['reward_points'];
            // this.userRewards = 5000;
            this.userAfterRewards = this.userRewards + this.rewardsEarned;
            // bottleneck the rewards night options to minimum of total nights of stay and available in reward points
            let rewardValue: number = +((this.userRewards / 5).toFixed(2)); // number of nights user can afford
            console.log("CHOOSING:" + this.details['nights'] + " OR " + Math.floor(this.subtotal / rewardValue));
            let max = Math.min(this.details['nights'], Math.floor(rewardValue / this.details['price'])); // max number of nights user can afford
            this.rewardNightsOptions = Array.from({length: max + 1}, (v, k) => k);
          },
          error: (error: any) => {
            console.log(error);
          }
        });
    }

    if (this.transaction_type === "cancel") {
      this.cancellationFee = this.checkCancellationFee();
      this.total -= this.cancellationFee;
    }

    if (this.transaction_type === "modify") {
      this.checkConflict();
      this.difference = this.details['total_price'] - this.total;
      if (this.difference <= 0) {
        this.positiveDifference = true;
      }
      this.difference = Math.abs(this.difference);
    }
  }
}