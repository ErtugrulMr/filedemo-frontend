import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private server = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  // define function to upload files

  upload(formData: FormData): Observable<HttpEvent<string[]>>{
    return this.httpClient.post<string[]>(this.server + "/file/upload", formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  // define function to download files

  download(fileName: string): Observable<HttpEvent<Blob>>{
    return this.httpClient.get(`${this.server}/file/download/${fileName}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    })
  }
}
