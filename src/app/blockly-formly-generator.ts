
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Generator } from 'blockly/core';

const INSTANCESPLIT = ',\n';


export const Order = {
    ATOMIC: 0,
};

export const formlyFieldConfigGenerator = new Generator('FORMLY_FIELD_CONFIG');


(formlyFieldConfigGenerator as any).scrub_ = function(block, code, thisOnly) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
      return code + INSTANCESPLIT + formlyFieldConfigGenerator.blockToCode(nextBlock);
    }
    return code;
};
  
//#region <!-- fields -->
formlyFieldConfigGenerator.forBlock['form'] = function (block, generator) {
    const fields = generator.statementToCode(block, 'fields') ?? '';
    return '[' + fields + ']';
}


formlyFieldConfigGenerator.forBlock['input'] = function (block, generator) {
    const rtnObject = {
        type: 'input'
    } as FormlyFieldConfig;

    const label_field: string | undefined = block.getFieldValue('label');
    if ((label_field ?? '').trim() !== '') {
        rtnObject.props = rtnObject.props ?? {};
        rtnObject.props.label = label_field.trim();
    }

    const key_field = generator.valueToCode(block, 'key', Order.ATOMIC);
    if ((key_field ?? '').trim() !== '') {
        rtnObject.key = key_field.trim();
    }

    const validation_statements = generator.statementToCode(block, 'validation');
    if ((validation_statements?.length ?? 0) > 0) {
        const validationList = validation_statements.split(INSTANCESPLIT);
        validationList.forEach(v => {
            const cleanedUp = v.trim();
            if (cleanedUp === 'REQUIRED') {
                rtnObject.props = rtnObject.props ?? {};
                rtnObject.props.required = true;
            } else {
                rtnObject.validators = rtnObject.validators ?? {};
                rtnObject.validators.validation = rtnObject.validators.validation ?? [];
                if (Array.isArray(rtnObject.validators.validation)) {
                    rtnObject.validators.validation.push(cleanedUp);
                }
            }
        })
    }
    console.log('validation', validation_statements)

    return JSON.stringify(rtnObject);
};
//#endregion

//#region <!-- value -->
formlyFieldConfigGenerator.forBlock['text'] = function (block, generator) {
    return [block.getFieldValue('TEXT') as string, Order.ATOMIC];
};

//#endregion

//#region <!-- validation -->
formlyFieldConfigGenerator.forBlock['validation_field_required'] = function (block, generator) {
    return "REQUIRED";
};

//#endregion