import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { visibility, flyInOut, expand } from '../animations/app.animation';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  dishFeedbackForm: FormGroup;
  dishFeedback: Comment;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';

  dishFormErrors = {
    'author': '',
    'comment': '',
  };

  dishValidationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must have at least one word.'
    }
  };

  @ViewChild('dform') 
  commentFormDirective;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private dfb: FormBuilder,
    @Inject('baseURL') private baseURL) { 
      this.createCommentForm();
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
        .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => this.errMess = <any>errmess);
    }
  
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

  goBack(): void {
    this.location.back();
  }

  createCommentForm(){
    this.dishFeedbackForm = this.dfb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2)]],
      date: ''
    });

    this.dishFeedbackForm.valueChanges
      .subscribe(data => this.onDishValueChanged(data));

    this.onDishValueChanged(); // (re)set validation messages now
  }

  onDishValueChanged(data?: any) {
    if (!this.dishFeedbackForm) { return; }
    const dform = this.dishFeedbackForm;
    for (const field in this.dishFormErrors) {
      if (this.dishFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.dishFormErrors[field] = '';
        const dcontrol = dform.get(field);
        if (dcontrol && dcontrol.dirty && !dcontrol.valid) {
          const dmessages = this.dishValidationMessages[field];
          for (const key in dcontrol.errors) {
            if (dcontrol.errors.hasOwnProperty(key)) {
              this.dishFormErrors[field] += dmessages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onDishSubmit() {
    this.dishFeedbackForm.value.date = new Date().toISOString();
    this.dishFeedback = this.dishFeedbackForm.value;
    console.log(this.dishFeedback);
    //DISHES[this.dish.id].comments.push(this.dishFeedback);
    this.dishcopy.comments.push(this.dishFeedback);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
    this.dishFeedbackForm.reset({
      author: '',
      rating: 5,
      comment: '',
      date: ''
    });
  }

}
