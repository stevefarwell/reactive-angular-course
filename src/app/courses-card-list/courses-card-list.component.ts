import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Course} from '../model/course';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {filter, tap} from 'rxjs/operators';
import { AuthStoreService } from '../services/auth-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent implements OnInit {

  @Input()
  courses: Course[] = [];

  @Output()
  private courseChanged: EventEmitter<any> = new EventEmitter();

  isLoggedIn$: Observable<boolean> = this.authStore.isLoggedIn$;

  constructor(private dialog: MatDialog, private authStore: AuthStoreService) {
  }

  ngOnInit(): void {

  }

  editCourse(course: Course): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => this.courseChanged.emit(true))
      )
      .subscribe();

  }

}
