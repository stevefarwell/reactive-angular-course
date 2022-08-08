import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const AUTH_DATA = 'auth_data';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  private user = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.user as Observable<User>;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {

    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

    const stUser: string = localStorage.getItem(AUTH_DATA);

    if (stUser) {
      this.user.next(JSON.parse(stUser) as User);
    }


  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password })
      .pipe(
        tap(user => {
            this.user.next(user);
            localStorage.setItem(AUTH_DATA, JSON.stringify(user));
          }
        ),
        shareReplay()
      );

  }

  logout() {
    this.user.next(null);
    localStorage.removeItem(AUTH_DATA);
  }


}
