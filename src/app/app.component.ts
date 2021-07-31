import { Component } from '@angular/core';
import { FileService } from './services/file.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'filedemo';
  fileNames: string[] = [];
  fileStatus = {status: '', requestType: '', percent: 0};


  constructor(private fileService: FileService) {}

  //define a funtion to upload files

  onUploadFiles(files: File[]): void{
    const formData = new FormData();
    for (const file of files){
      formData.append('files', file, file.name);
        this.fileService.upload(formData).subscribe(
        event=>{
          console.log(event);
          this.reportProgress(event);
        },
        (error: HttpErrorResponse) =>{
          console.error(error);
        }
      );
    }
  }

  //define a funtion to download files

  onDownloadFiles(fileName: string): void{
    this.fileService.download(fileName).subscribe(
      event=>{
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) =>{
        console.error(error);
      }
    )
  }

  private reportProgress(httpEvent: HttpEvent<string[] | Blob>): void{
    switch(httpEvent.type){
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if(httpEvent.body instanceof Array){
          for(const fileName of httpEvent.body){
            if(!this.fileNames.includes(fileName)){
              this.fileNames.unshift(fileName);
            }
          }
        }
        else{
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
          {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));

          // saveAs(new Blob([httpEvent.body!], {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}),
          // httpEvent.headers.get('File-Name'));
        }
        break;
      default:
        console.log(httpEvent);
    }
  }
  private updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = (Math.round((loaded / total)*100));
  }
}
