import { CommonModule } from '@angular/common';
import { Component, OnInit, SecurityContext, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../service/api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownModule, MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, MarkdownModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
  providers: [MarkdownService,
    { provide: SECURITY_CONTEXT, useValue: SecurityContext.HTML }
  ]
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  chatOpen: boolean = false;
  messages: Array<any> = [];
  currentUser: string = '';
  loading: boolean = false;
  messagesIn: boolean = false;

  chatForm = new FormGroup({
    userPrompt: new FormControl('', Validators.required),
  });

  constructor(private apiService: ApiService) {}

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 1);
  }

  sendMessage(): void {
    if (this.chatForm.invalid) {
      return;
    }
    this.messagesIn = true;
    this.loading = true;
    console.log('Message send requested');
    // add user message to chat
    this.messages.push({"role": "user", "content": this.chatForm.value.userPrompt, "timestamp": new Date(), "name": this.currentUser, "id": 1});
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 1);
    this.apiService.postBackendRequest('send-message', this.chatForm.value)
      .subscribe({
        next: (response: any) => {
          console.log('RAW Response received:');
          console.log(response);

          response['content'] = JSON.parse(response['content']); // format the response to json object
          this.messages.push(response); // response has fields role, content, date, id, name (if role is user)
          setTimeout(() => {
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
          }, 1);
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
    this.messagesIn = false;
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
            if (message['role'] !== 'system') {
              this.messagesIn = true;
            }
            if (message['role'] === 'assistant') {
              message['content'] = JSON.parse(message['content']);
            }
          }
          this.messages = response;
          setTimeout(() => {
            this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
          }, 1);
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