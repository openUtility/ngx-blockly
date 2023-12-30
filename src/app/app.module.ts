import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Order, javascriptGenerator } from 'blockly/javascript';
import { luaGenerator } from 'blockly/lua';
// import { NgxBlocklyModule } from '@openUtility/ngx-blockly';


import 'blockly/blocks';
import { NgxBlocklyComponent, BLOCKY_CODE_GENERATORS } from '@openUtility/ngx-blockly';

 javascriptGenerator.forBlock['page'] = function(block, generator) {
     // String or array length.
     
    const statement = generator.statementToCode(block, 'input_statement');
        // Get the field value.
    const fieldValue = block.getFieldValue('FIELDNAME');

    // Concatenate the code.
    const code = `${statement}: ${fieldValue} some more code`;

    // Return the code.
     return code;
     

    // var argument0 = generator.valueToCode(block, 'FIELDNAME', Order.FUNCTION_CALL) || '\'\'';
    // return [argument0 + '.checked', Order.MEMBER];
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        //NgxBlocklyModule
        NgxBlocklyComponent
    ],
    providers: [
        {
            provide: BLOCKY_CODE_GENERATORS,
            useValue: javascriptGenerator,
            multi: true
        },
        {
            provide: BLOCKY_CODE_GENERATORS,
            useValue: luaGenerator,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
