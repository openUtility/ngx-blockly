import { javascriptGenerator } from 'blockly/javascript';
import { luaGenerator } from 'blockly/lua';
import { formlyFieldConfigGenerator } from './blockly-formly-generator';
// import { NgxBlocklyModule } from '@openUtility/ngx-blockly';



import { BLOCKY_CODE_GENERATORS } from '@openUtility/ngx-blockly';

javascriptGenerator.forBlock['page'] = function (block, generator) {
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

export const BLOCKLY_GENERATORS = [
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
    {
        provide: BLOCKY_CODE_GENERATORS,
        useValue: formlyFieldConfigGenerator,
        multi: true
    }
]