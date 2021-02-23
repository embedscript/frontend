import { Injectable } from '@angular/core';
import { UserService } from "./user.service";
import * as files from '@m3o/services/files'
import {
  HttpClient,
  HttpEventType,
  HttpDownloadProgressEvent,
} from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private us: UserService, private http: HttpClient) {}

  list(project? : string): Promise<files.File[]> {
    var req: files.ListRequest = {}
    if (project) {
      req.project = project
    }
    return new Promise<files.File[]>((resolve, reject) => {
      var headers = {
        //"micro-namespace": this.us.namespace(),
        "Micro-Namespace": environment.namespace,
      } 
      if (this.us.token().length > 0) {
        headers['authorization'] = this.us.token()

      }
      return this.http
        .post<files.ListResponse>(
          environment.apiUrl + "/files/list",
          req,
          {
            headers: headers,
          }
        )
        .toPromise()
        .then((servs) => {
          resolve(servs.files as files.File[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  save(files :files.File[]): Promise<void> {
    const req: files.SaveRequest = {
      files: files,
    }
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<files.SaveResponse>(
          environment.apiUrl + "/files/save",
          req,
          {
            headers: {
              authorization: this.us.token(),
              //"micro-namespace": this.us.namespace(),
              "Micro-Namespace": environment.namespace,
            },
          }
        )
        .toPromise()
        .then((servs) => {
          alert("succ")
          resolve();
        })
        .catch((e) => {
          alert("fail")
          reject(e);
        });
    });
  }
}
