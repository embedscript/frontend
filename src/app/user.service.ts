import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

interface ReadUserResponse {
  user: types.Account;
}

interface InspectResponse {
  account: types.Account;
}

interface Token {
  access_token: string;
  refresh_token: string;
  created: string;
  expiry: string;
}

interface TokenResponse {
  token: Token;
}

interface CompleteSignupResponse {
  authToken: Token;
  namespace: string;
}

@Injectable()
export class UserService {
  public user: types.Account = {} as types.Account;
  public isUserLoggedIn = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private notif: NotificationsService,
    private router: Router
  ) {
    this.get()
      .then((user) => {
        for (const k of Object.keys(user)) {
          this.user[k] = user[k];
        }
        this.isUserLoggedIn.next(true);
        this.initProject(this.projectID());
      })
      .catch((e) => {
        this.isUserLoggedIn.next(false);
      });
  }

  loggedIn(): boolean {
    return this.user && this.user.name != undefined;
  }

  projectID(): string {
    if (!this.user?.id) {
      return '';
    }
    const md5 = new Md5();
    return md5.appendStr(this.user.id).end().toString();
  }

  logout() {
    // todo We are nulling out the name here because that's what we use
    // for user existence checks.
    this.user.name = '';
    this.cookie.set('micro_token', '', 30, null, null, null, null);
    this.cookie.set('micro_refresh', '', 30, null, null, null, null);
    this.cookie.set('micro_expiry', '', 30, null, null, null, null);
    document.location.href = '/';
  }

  // this method should be in the datastore service
  // it creates a dummy rule to establish ownership
  // of a project
  initProject(project: string): Promise<void> {
    var req = {
      rule: {
        project: project,
        table: '_internal',
        action: 'write',
        role: 'admin',
      },
    };
    return new Promise<void>((resolve, reject) => {
      var headers = {
        'Micro-Namespace': environment.namespace,
      };
      if (this.token().length > 0) {
        headers['authorization'] = this.token();
      }
      return this.http
        .post(environment.apiUrl + '/datastore/createRule', req, {
          headers: headers,
        })
        .toPromise()
        .then((servs) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  // gets current user
  get(): Promise<types.Account> {
    return new Promise<types.Account>((resolve, reject) => {
      if (!this.cookie.get('micro_token')) {
        return reject('Cookie not found');
      }
      return this.refresh().then(() => {
        return this.http
          .post<InspectResponse>(environment.apiUrl + '/auth/Auth/Inspect', {
            token: this.cookie.get('micro_token'),
            options: {
              namespace: this.namespace(),
            },
          })
          .toPromise()
          .then((userResponse) => {
            const user = userResponse.account;
            if (user.metadata && user.metadata['username']) {
              user.name = user.metadata['username'];
            } else {
              user.name = user.id;
            }
            resolve(user);
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  }

  token(): string {
    if (this.cookie.get('micro_token').length === 0) {
      return '';
    }
    return 'Bearer ' + this.cookie.get('micro_token');
  }

  refreshToken(): string {
    return this.cookie.get('micro_refresh');
  }

  namespace(): string {
    return this.cookie.get('micro_namespace');
  }

  login(email: string, password: string, namespace: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(environment.apiUrl + '/auth/Auth/Token', {
          id: email,
          secret: password,
          options: {
            namespace: namespace,
          },
          token_expiry: 30 * 24 * 3600,
        })
        .toPromise()
        .then((userResponse) => {
          const tok = userResponse.token;
          // ugly param list, see: https://github.com/stevermeister/ngx-cookie-service/issues/86
          this.cookie.set(
            'micro_token',
            tok.access_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_refresh',
            tok.refresh_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_expiry',
            tok.expiry,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_namespace',
            namespace,
            30,
            '/',
            null,
            null,
            null
          );
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  sendVerification(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/signup/SendVerificationEmail',
          {
            email: email,
          },
          {
            headers: {
              'Micro-Namespace': environment.namespace,
            },
          }
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  sendRecover(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/signup/recover',
          {
            email: email,
          },
          {
            headers: {
              'Micro-Namespace': environment.namespace,
            },
          }
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<void> {
    var headers = {
      //"micro-namespace": this.us.namespace(),
      'Micro-Namespace': environment.namespace,
    };
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/signup/resetPassword',
          {
            email: email,
            token: token,
            password: newPassword,
            namespace: environment.namespace,
          },
          { headers: headers }
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  verify(
    email: string,
    username: string,
    password: string,
    verificationCode: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post(
          environment.apiUrl + '/signup/Verify',
          {
            email: email,
            token: verificationCode,
          },
          {
            headers: {
              'Micro-Namespace': environment.namespace,
            },
          }
        )
        .toPromise()
        .then((userResponse) => {
          return this.http
            .post<CompleteSignupResponse>(
              environment.apiUrl + '/signup/CompleteSignup',
              {
                email: email,
                username: username,
                token: verificationCode,
                secret: password,
              },
              {
                headers: {
                  'Micro-Namespace': environment.namespace,
                },
              }
            )
            .toPromise()
            .then((resp) => {
              var tok = resp.authToken;
              this.cookie.set(
                'micro_token',
                tok.access_token,
                30,
                '/',
                null,
                null,
                null
              );
              this.cookie.set(
                'micro_refresh',
                tok.refresh_token,
                30,
                '/',
                null,
                null,
                null
              );
              this.cookie.set(
                'micro_expiry',
                tok.expiry,
                30,
                '/',
                null,
                null,
                null
              );
              this.cookie.set(
                'micro_namespace',
                resp.namespace,
                30,
                '/',
                null,
                null,
                null
              );
              resolve();
            });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  refresh(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var expiry = parseInt(this.cookie.get('micro_expiry')) * 1000;
      if (expiry - Date.now() > 60 * 1000) {
        return resolve();
      }
      return this.http
        .post<TokenResponse>(environment.apiUrl + '/auth/Auth/Token', {
          refresh_token: this.cookie.get('micro_refresh'),
          options: {
            namespace: this.namespace(),
          },
        })
        .toPromise()
        .then((tokenResponse) => {
          const tok = tokenResponse.token;
          // ugly param list, see: https://github.com/stevermeister/ngx-cookie-service/issues/86
          this.cookie.set(
            'micro_token',
            tok.access_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_refresh',
            tok.refresh_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_expiry',
            tok.expiry,
            30,
            '/',
            null,
            null,
            null
          );
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
