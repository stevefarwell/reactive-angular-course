import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { catchError, filter, map, shareReplay, tap } from 'rxjs/operators';
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

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {

    const courses = this.courses.getValue();

    const index = courses.findIndex(course => course.id === courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes
    };

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;

    this.courses.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not save courses';
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        shareReplay()
      );

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
