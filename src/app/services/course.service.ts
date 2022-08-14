import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Lesson } from '../model/lesson';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) {
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        shareReplay()
      );
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        filter: search,
        pageSize: '100'
      }
    }).pipe(
      map(res => res['payload']),
      shareReplay()
    );
  }

}
