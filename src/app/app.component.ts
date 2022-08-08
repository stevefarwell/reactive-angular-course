import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading/loading.service';
import { MessagesService } from './messages/messages.service';
import { AuthStoreService } from './services/auth-store.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],

})
export class AppComponent implements OnInit {

  isLoggedOut$: Observable<boolean> = this.authStore.isLoggedOut$;
  isLoggedIn$: Observable<boolean> = this.authStore.isLoggedIn$;

  constructor( private authStore: AuthStoreService) {
  }

  ngOnInit() {


  }

  logout() {
    this.authStore.logout();
  }

}
