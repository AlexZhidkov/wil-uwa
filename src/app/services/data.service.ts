import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getFaculties(): string[] {
    return [
      'FABLE',
      'Science',
      'Engineering'
    ];
  }

  getTimestamp(d: Date): number {
    return d.getTime();
  }
}
