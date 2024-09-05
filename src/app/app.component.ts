import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from './service/question.service';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

interface Question {
  _id?: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'qna';
  error: boolean = false;
  message: string = '';
  questions: Question[] = [];
  question: Question;
  questionId: string;

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute
  ) {}

  questionForm: FormGroup = new FormGroup({
    question: new FormControl('', Validators.required),
    answer: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionId = params.id;
      if (!!this.questionId) {
        this.questionService
          .get('questions/getOne/' + this.questionId)
          .pipe(
            catchError((err) => throwError(err)),
            map((data) => data)
          )
          .subscribe((resp) => {
            this.questionForm.setValue({
              question: resp.question,
              answer: resp.answer,
            });
          });
      }
    });

    this.questionService
      .get('questions')
      .pipe(
        catchError((err) => throwError(err)),
        map((data) => data)
      )
      .subscribe((resp) => (this.questions = resp));
  }

  submit() {
    if (!!this.questionId) {
      this.questionService
        .put('questions/update/' + this.questionId, this.questionForm.value)
        .pipe(
          map((body: any) => {
            return body;
          }),
          catchError((err) => throwError(err))
        )
        .subscribe((data: any) => {
          const objIndex = this.questions.findIndex(
            (obj) => obj._id == data._id
          );
          this.questions[objIndex] = data;
          this.questionForm.setValue({
            question: '',
            answer: '',
          });
        });
    } else {
      this.questionService
        .post('questions', this.questionForm.value)
        .pipe(
          map((body: any) => {
            return body;
          }),
          catchError((err) => throwError(err))
        )
        .subscribe((data: any) => {
          this.questionForm.setValue({
            question: '',
            answer: '',
          });
          this.questions.push(data);
        });
    }
  }

  deleteQuestion(id) {
    this.questionService
      .delete('questions/delete/' + id)
      .pipe(
        map((body: any) => {
          return body;
        }),
        catchError((err) => throwError(err))
      )
      .subscribe((data: any) => {
        this.questions = this.questions.filter((el) => el._id !== data.id);
      });
  }
}
