import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../service/api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  chatOpen: boolean = true; // TODO init to false in prod
  messages: Array<any> = [];
  currentUser: string = '';
  loading: boolean = false;

  chatForm = new FormGroup({
    userPrompt: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiService) {}

  formatDate(currentDate: Date) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
  }

  sendMessage(): void {
    if (this.chatForm.invalid) {
      return;
    }
    this.loading = true;
    console.log('Message send requested');
    // add user message to chat
    this.messages.push({"role": "user", "content": this.chatForm.value.userPrompt, "timestamp": this.formatDate(new Date()), "name": this.currentUser, "id": 1});
    this.apiService.postBackendRequest('send-message', this.chatForm.value)
      .subscribe({
        next: (response: any) => {
          console.log('RAW Response received:');
          console.log(response);

          response['content'] = JSON.parse(response['content']); // format the response to json object
          this.messages.push(response); // response has fields role, content, date, id, name (if role is user)
          this.loading = false;
        },
        error: (error: any) => {
          console.log('Error sending message');
          console.log(error);
          this.loading = false;
        }
    });
    this.chatForm.patchValue({userPrompt: ""});
  }

  clearChat(): void {
    console.log('Chat clear requested');
    this.messages = [];
    this.apiService.getBackendRequest('clear-chat')
      .subscribe({
        next: (response: any) => {
          console.log('Chat cleared');
          this.messages = [];
        },
        error: (error: any) => {
          console.log('Error clearing chat');
          console.log(error);
        }
    }); 
  }

  getMessages(): void {
    console.log('Fetching messages started');
    this.apiService.getBackendRequest('get-messages')
      .subscribe({
        next: (response: any) => {
          console.log('Messages fetched');
          console.log(response);
          // format all assistant responses to json object
          for (const message of response) {
            if (message['role'] === 'assistant') {
              message['content'] = JSON.parse(message['content']);
            }
          }
          this.messages = response;
        },
        error: (error: any) => {
          console.log('Error fetching messages');
          console.log(error);
        }
    }); 
  }

  ngOnInit(): void {
    this.apiService.getBackendRequest('get-session')
    .subscribe({
      next: (response) => {
        console.log(response);
        this.currentUser = response['first_name'] + ' ' + response['last_name'];
        this.getMessages();
      },
      error: (error) => { 
        console.log(error);
      }
    });
  }
}