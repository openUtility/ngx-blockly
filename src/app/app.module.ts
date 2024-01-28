import { BrowserModule } from '@angular/platform-browser';
import { NgModule, importProvidersFrom } from '@angular/core';

import { AppComponent } from './app.component';

import { FormConfigService } from './form-config.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { FormPageComponent } from './form-page.component';
import { RouterModule, Routes } from '@angular/router';
import { BlocklyPageComponent } from './blockly-page.component';

 


const appRoutes: Routes = [
    {
        path: '', component: BlocklyPageComponent, providers: [

    ]},
    {
        path: 'form', component: FormPageComponent, providers: [
            importProvidersFrom(FormlyModule.forRoot())
    ]},
  ];
  


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        //NgxBlocklyModule
        ReactiveFormsModule,
        RouterModule.forRoot(
            appRoutes, 
        )
    ],
    providers: [
        
        FormConfigService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
