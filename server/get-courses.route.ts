import { Request, Response } from 'express';
import { COURSES } from './db-data';


export function getAllCourses(req: Request, res: Response) {

  /*console.log('ERROR loading courses!');
  res.status(500).json({message: 'random error occurred.'});
  return;*/

  setTimeout(() => {
    res.status(200).json({ payload: Object.values(COURSES) });
  }, 200);
}


export function getCourseById(req: Request, res: Response) {
  console.log('req: ', typeof req.params['id']);
  const courseId = parseInt(req.params['id'], 10);

  const courses: any = Object.values(COURSES);
  // console.log('courses: ', courses);

  const course = courses.find(item => item.id === courseId);

  console.log('course: ', course);

  res.status(200).json(course);
}
