import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import * as types from './types';
import {
  HttpClient,
  HttpEventType,
  HttpDownloadProgressEvent,
} from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private us: UserService, private http: HttpClient) {}

  list(
    project?: string,
    ownerName?: string,
    projects?: string[]
  ): Promise<types.File[]> {
    var req = {};
    if (project) {
      req['project'] = project;
    }
    if (ownerName) {
      req['username'] = ownerName;
    }
    if (projects) {
      req['projects'] = projects;
    }
    return new Promise<types.File[]>((resolve, reject) => {
      var headers = {
        //"micro-namespace": this.us.namespace(),
        'Micro-Namespace': environment.namespace,
      };
      if (this.us.token().length > 0) {
        headers['authorization'] = this.us.token();
      }
      return this.http
        .post<types.ListResponse>(environment.apiUrl + '/files/list', req, {
          headers: headers,
        })
        .toPromise()
        .then((servs) => {
          resolve(servs.files as types.File[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  save(files: types.File[]): Promise<void> {
    const req: types.SaveRequest = {
      files: files,
    };
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<types.SaveResponse>(environment.apiUrl + '/files/save', req, {
          headers: {
            authorization: this.us.token(),
            //"micro-namespace": this.us.namespace(),
            'Micro-Namespace': environment.namespace,
          },
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
}
