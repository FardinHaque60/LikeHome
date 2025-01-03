import { Component, OnInit, HostBinding } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterLink, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, ReactiveFormsModule, MatDatepickerModule, MatTooltipModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailsComponent implements OnInit{
  signedIn: boolean = false;

  // used when clicked from search-results
  details: any = {};
  rooms: Array<any> = []; 
  addedToWatchlist: boolean = false;
  currencyOptions: Array<string> = []
  originalRates: any = {
    'currency': 0,
    'minRate': 0,
    'maxRate': 0,
    'rooms': [],
  }; // initialized in the initCurrencyOptions function
  currencyCode: string = ''; // three letter code that selects from dropdown
  currencyForm = new FormGroup({
    currency: new FormControl('', Validators.required),
  });
  
  dateChecker: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    const checkIn = form.get('checkIn')?.value;
    const checkOut = form.get('checkOut')?.value;
    const today = new Date();

    const isFutureCheckIn = checkIn && checkIn > today;
    const isFutureCheckOut = checkOut && checkOut > today;
    const isCheckInBeforeCheckOut = checkIn && checkOut && checkIn < checkOut;

    return isFutureCheckIn && isFutureCheckOut && isCheckInBeforeCheckOut ? null : { invalidDate: true };
  }

  // used when clicked from account-details
  accountDetails: any = {};
  isAccount: boolean = false;
  modifying: boolean = false;
  modifyRoom: any = {};
  modifyForm = new FormGroup({
    checkIn: new FormControl<Date | null>(null),
    checkOut: new FormControl<Date | null>(null),
    nights: new FormControl<number | null>(null),
    id: new FormControl(0, Validators.required),
  }, { validators: this.dateChecker });

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  // used for formatting when modifying the date
  selectionFormatDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    // create a date in UTC, then get the local equivalent
    return new Date(Date.UTC(year, month-1, day+1));
  }

  // used for formatting when sending the date to backend to save
  sendFormatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObj.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  startModify(reservationId: number) { 
    this.modifying = true;
    console.log("start modifying");
    this.modifyRoom = this.accountDetails;
    // initialize form with current values
    this.modifyForm.setValue({
      checkIn: this.selectionFormatDate(this.accountDetails['check_in']),
      checkOut: this.selectionFormatDate(this.accountDetails['check_out']),
      nights: this.accountDetails['nights'],
      id: reservationId,
    })
    console.log(this.modifyRoom);
  }

  endModify() { 
    console.log("end modifying");
    if (this.modifyForm.invalid) {
      alert("Invalid check in or check out dates");
      return;
    }
    console.log(this.modifyForm.value);
    console.log(this.accountDetails);

    // send updated accountDetails object to checkout page
    this.accountDetails['originalCheckIn'] = this.accountDetails['check_in'];
    this.accountDetails['originalCheckOut'] = this.accountDetails['check_out'];
    this.accountDetails['checkIn'] = this.sendFormatDate(this.modifyForm.value.checkIn);
    this.accountDetails['checkOut'] = this.sendFormatDate(this.modifyForm.value.checkOut);
    this.accountDetails['price'] = this.accountDetails['rate'];
    this.accountDetails['hotel'] = this.accountDetails['hotel_name'];
    this.accountDetails['nights'] = this.modifyForm.value.nights;
    this.accountDetails['room'] = this.accountDetails['room_name'];
    this.accountDetails['reservationId'] = this.modifyForm.value.id;
    this.modifying = false;
    this.router.navigate(['/checkout'], { queryParams: 
      { 
        details: JSON.stringify(this.accountDetails),
        type: 'modify',
      } 
    }); 
  }

  cancelModify() {
    console.log("cancel modifying");
    this.modifying = false;
  }

  replaceImage(event: any) {
    event.target.src = 'assets/images/nexus_logo.png';
  }

  getImage(i: number): string {
    return this.details['images'][i];
  }

  addToWatchlist() {
    console.log("add to watchlist clicked");
    this.apiService.postBackendRequest('add-to-watchlist', this.details) 
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.addedToWatchlist = true;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  removeFromWatchlist() {
    console.log("remove from watchlist clicked");
    this.apiService.postBackendRequest('remove-from-watchlist', { 'rooms': this.rooms}) 
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.addedToWatchlist = false;
      },
      error: (error: any) => {
        console.log(error);
        alert("Error removing from watchlist");
      }
    });
  }

  checkout(i: number) {
    // ensure user is logged in
    if (this.signedIn) {
      console.log("checkout request made");
      let room = this.rooms[i];
      let details = {
        'hotel': this.details['name'],
        'room': room['name'],
        'price': +this.originalRates['rooms'][i], // pass original price to checkout
        'adults': room['adults'],
        'children': room['children'],
        'checkIn': this.details['checkIn'],
        'checkOut': this.details['checkOut'],
        'nights': this.details['nights'],
        'address': this.details['address'],
        'city': this.details['city'],
        'images': this.details['images'],
        'description': this.details['description'],
        'phone': this.details['phone'],
        'website': this.details['web'],
        'email': this.details['email'],
      }
      console.log("details sent to checkout: " + details);
      this.router.navigate(['/checkout'], { queryParams: 
        { 
          details: JSON.stringify(details),
          type: 'new',
        } 
      });
    }
    else {
      alert("Please login to book a room");
    }
  }

  calculateDaysBetween(date1: string, date2: string): number {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    // Calculate the difference in milliseconds
    const diffInMs = secondDate.getTime() - firstDate.getTime();
    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    return Math.abs(diffInDays); // Use Math.abs to handle negative values
  }

  backToAccount(){
    this.router.navigate(['/account-details']);
  }

  updateCheckIn(val: Date | null | undefined) {
    this.modifyForm.patchValue(
      { 
        nights: this.calculateDaysBetween(
          this.sendFormatDate(val), 
          this.sendFormatDate(this.modifyForm.value.checkOut)
        ) 
      }
    );
  }

  updateCheckOut(val: Date | null | undefined) {
    this.modifyForm.patchValue(
      { 
        nights: this.calculateDaysBetween(
          this.sendFormatDate(this.modifyForm.value.checkIn), 
          this.sendFormatDate(val)
        ) 
      }
    );
  }

  isWatchlist() {
    console.log("room data sent " + this.rooms);
    this.apiService.postBackendRequest('is-watchlist', this.details['rooms'])
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.addedToWatchlist = false;
      },
      error: (error: any) => {
        console.log(error);
        this.addedToWatchlist = true;
      }
    });
  }

  convertCurrency() {
    this.currencyCode = this.currencyForm.value.currency?.substring(0, 3) ? this.currencyForm.value.currency.substring(0, 3) : '';
    let currencyOptions = {
      'fromCurrency': this.originalRates['currency'],
      'toCurrency': this.currencyCode,
    }
    // returns the rate for fromCurrency to toCurrency
    this.apiService.postBackendRequest('currency-convert', currencyOptions)
      .subscribe({
        next: (data: any) => {
          // use the rate to reassign each room value netRate (for each room), minRate, maxRate
          console.log(data);
          // convert each rooms netRate
          let i = 0;
          for (const room of this.rooms) {
            room['netRate'] = +(this.originalRates['rooms'][i] * data['rate']).toFixed(2);
            i++;
          }
          // convert the minRate and maxRate on details panel
          this.details['minRate'] = +(this.originalRates['minRate'] * data['rate']).toFixed(2);
          this.details['maxRate'] = +(this.originalRates['maxRate'] * data['rate']).toFixed(2);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }

  initCurrencyOptions() {
    let originalCurrency = this.details['currency'].toLowerCase(); // currency that api returns
    let currency = 'usd'; // default currency
    this.currencyCode = currency;
    this.apiService.getBackendRequest('get-currency-list')
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.currencyOptions = data; // sets currency list returned from backend
          // set default currency to USD
          this.currencyForm.setValue({ currency: "usd (US Dollar)" });
          /* 
          for (const option of this.currencyOptions) {
            if (option.substring(0, 3) === currency) {
              this.currencyForm.setValue({ currency: option });
              break;
            }
          } */
        },
        error: (error: any) => {
          console.log(error);
        }
      });
      // convert from currency in api to USD
      let currencyOptions = {
        'fromCurrency': originalCurrency,
        'toCurrency': this.currencyCode,
      }
      // returns the rate for fromCurrency to toCurrency
      this.apiService.postBackendRequest('currency-convert', currencyOptions)
        .subscribe({
          next: (data: any) => {
            // use the rate to reassign each room value netRate (for each room), minRate, maxRate
            console.log(data);
            // store the original rates for conversion
            let originalRoomRates = [];
            for (const room of this.rooms) {
              room['netRate'] = (room['netRate'] * data['rate']).toFixed(2);
              originalRoomRates.push(room['netRate']);
            }
            this.details['minRate'] = (this.details['minRate'] * data['rate']).toFixed(2); 
            this.details['maxRate'] = (this.details['maxRate'] * data['rate']).toFixed(2);
            this.originalRates = {
              'currency': currency,
              'minRate': this.details['minRate'],
              'maxRate': this.details['maxRate'],
              'rooms': originalRoomRates,
            };
          },
          error: (error: any) => {
            console.log(error);
          }
        });
  }

  ngOnInit(): void {
      //  listen for changes in check in/ out for hotel details from myBookings to compute nights
      this.modifyForm.get('checkIn')?.valueChanges.subscribe((value) => this.updateCheckIn(value));
      this.modifyForm.get('checkOut')?.valueChanges.subscribe((value) => this.updateCheckOut(value));

      this.apiService.getBackendRequest('get-session')
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.signedIn = true;
        },
        error: (error: any) => {
          console.log(error);
          this.signedIn = false;
        }
      });

      // moves to the top of the page when finished navigating (back&forth)
      // TODO seems to not work with <-- back arrows
      this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              window.scrollTo(0, 0)
          }
      });

      // receive params from hotel see details
      this.route.queryParams.subscribe(params => {
        this.details = JSON.parse(params['details']);
        this.details['checkIn'] = params['checkIn'];
        this.details['checkOut'] = params['checkOut'];
        this.details['nights'] = this.calculateDaysBetween(this.details['checkIn'], this.details['checkOut']);
        this.rooms = this.details['rooms'];
        this.initCurrencyOptions(); // init list of currency options and set default from dropdown
      });

      this.isWatchlist(); // check if this hotel is in watchlist

      // receives parameters from the account-details Page
      this.route.queryParams.subscribe(params => {
        this.accountDetails = JSON.parse(params['accountDetails']);
        console.log(this.accountDetails);
        this.isAccount = params['fromAccount'];
        // html will show both pages based on data from search-results OR account details
        //tells us that this is from the account-details page
        console.log(this.isAccount);
      });
  }
}