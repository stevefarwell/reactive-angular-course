import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CourseService } from '../services/course.service';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: [ './course.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService) {
  }

  ngOnInit() {

    const courseId = this.route.snapshot.paramMap.get('courseId');

    const course$ = this.courseService.loadCourseById(courseId)
      .pipe(
        startWith(null)
      );
    const lessons$ = this.courseService.loadAllCourseLessons(courseId).pipe(
      startWith([])
    );

    this.data$ = combineLatest([ course$, lessons$ ])
      .pipe(
        map(([ course, lessons ]) => {
          return {
            course,
            lessons
          };
        })
      );
  }


}











