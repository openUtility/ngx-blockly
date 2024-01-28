import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, untracked } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { FormConfigService } from './form-config.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
  ],
  template: `
  <main class="container">
    <h1>Form</h1>
    <form [formGroup]="form">
      <formly-form [model]="model" [fields]="fields()" [options]="options" [form]="form"></formly-form>
    </form>

    <section>
    <h2>value</h2>
    <code><pre>{{form.value | json}}</pre></code>
    </section>
    <section>
    <h2>Fields</h2>
    <code><pre>{{fields() | json}}</pre></code>
    </section>
    </main>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPageComponent {
  private readonly changeRef = inject(ChangeDetectorRef);
  private readonly formSrv = inject(FormConfigService);
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields = this.formSrv.formlyFieldConfig;
  constructor() {
    effect(() => {
      this.fields();
      untracked(() => this.changeRef.markForCheck());
    })
  }
}
