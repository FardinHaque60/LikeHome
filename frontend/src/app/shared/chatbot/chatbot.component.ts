import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  chatOpen: boolean = true;

  constructor(apiService: ApiService) {}

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
  }

  sendMessage(): void {
    console.log('Message send requested');
  }

  clearChat(): void {
    console.log('Chat clear requested');
  }

}