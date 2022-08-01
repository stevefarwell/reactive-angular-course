import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private courses = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.courses.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messagesService: MessagesService) {

    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map((resp: Course[]) => resp['payload']),
        catchError(err => {
          const message = 'Could not load courses';
          this.messagesService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(courses => this.courses.next(courses))
      );

    this.loading.showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(
          (courses: Course[]) => courses
            .filter(course => course.category === category)
            .sort(sortCoursesBySeqNo)
        )
      );
  }
}
