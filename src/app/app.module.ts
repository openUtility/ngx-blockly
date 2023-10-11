import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxBlocklyNewModule } from '../../projects/ngx-blockly-new/src/lib/ngx-blockly.module';


import 'blockly/blocks';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgxBlocklyNewModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
