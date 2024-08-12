// ------------------------------------------- Template Form ---------------------------------------------------

// import {
//   afterNextRender,
//   Component,
//   DestroyRef,
//   inject,
//   signal,
//   viewChild,
// } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { debounceTime } from 'rxjs';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
//   imports: [FormsModule],
// })
// export class LoginComponent {
//   private forms = viewChild.required<NgForm>('form');
//   private destroyRef = inject(DestroyRef);
//   constructor() {
//     afterNextRender(() => {
//       const savedForm = window.localStorage.getItem('saved-form-data');

//       if (savedForm) {
//         const loadedFormData = JSON.parse(savedForm);
//         const Savedemail = loadedFormData.email;
//         setTimeout(() => {
//           this.forms().controls['email'].setValue(Savedemail);
//         }, 1);
//       }

//       const subscription = this.forms()
//         .valueChanges?.pipe(debounceTime(500))
//         .subscribe({
//           next: (value) =>
//             window.localStorage.setItem(
//               'saved-form-data',
//               JSON.stringify({ email: value.email })
//             ),
//         });
//       this.destroyRef.onDestroy(() => subscription?.unsubscribe());
//     });
//   }

//   OnSubmit(form: NgForm) {
//     console.log(form);
//     form.reset();
//   }
// }
// -------------------------------------------------------------------------------------------------------------------

// import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of, scan } from 'rxjs';

function mustContainAQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainTheQuestionMark: true };
}

function IsEmailIsUnique(control: AbstractControl) {
  if (control.value !== 'text@gmail.com') {
    return of(null);
  }

  return of({ emailIsNotUnique: true });
}
let initialEmailValue = '';
const savedForm = localStorage.getItem('the-email');

if (savedForm) {
  const loadedFormData = JSON.parse(savedForm);
  initialEmailValue = loadedFormData.email;
}
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule],
})

export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [IsEmailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainAQuestionMark,
      ],
    }),
  });

  get InValidEmail() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get InValidPassword() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit(): void {
    if (savedForm) {
      const loadedFormData = JSON.parse(savedForm);
      this.form.patchValue({
        email: loadedFormData.email,
        password: loadedFormData.password,
      });
    }

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem('the-email', JSON.stringify(value));
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.form);
    console.log(this.form.value.email);
    console.log(this.form.value.password);
  }
}
