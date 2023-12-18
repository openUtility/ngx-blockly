import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// import { NgxBlocklyModule } from '@openUtility/ngx-blockly';


import 'blockly/blocks';
import { NgxBlocklyComponent } from '@openUtility/ngx-blockly';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        //NgxBlocklyModule
        NgxBlocklyComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
