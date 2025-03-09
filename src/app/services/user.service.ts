import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  sendMessage(messageData: any) {
    return this.httpClient.post('users/contact', messageData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
