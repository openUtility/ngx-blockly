import {
    CustomBlock,

} from '@openUtility/ngx-blockly';
import { Field, fieldRegistry, utils, Extensions } from 'blockly/core';



class FormlyField extends Field {

    constructor(value: any, validator?: any) {
        super(value, validator);
        this.SERIALIZABLE = true;
    }

    public static fromJson(options) {
        const value = utils.parsing.replaceMessageReferences(
            options['value']);
        return new FormlyField(value);
    };

}

Extensions.registerMutator('FORMLY_FIELD', {
    saveExtraState: function () {
        const rtnObj = {};

        if (this.hideLabel_) {
            rtnObj['hideLabel'] = true;
        }

        return rtnObj;
    },

    loadExtraState: function (state) {
        this.itemCount_ = state['itemCount'];
        // This is a helper function which adds or removes inputs from the block.
        //this.updateShape_();
    },
    decompose: function (workspace) {
        // This is a special sub-block that only gets created in the mutator UI.
        // It acts as our "top block"
        var topBlock = workspace.newBlock('formly_field_settings');
        topBlock.initSvg();

        // Then we add one sub-block for each item in the list.
        // var connection = topBlock.getInput('STACK').connection;
        // for (var i = 0; i < this.itemCount_; i++) {
        //   var itemBlock = workspace.newBlock('lists_create_with_item');
        //   itemBlock.initSvg();
        //   connection.connect(itemBlock.previousConnection);
        //   connection = itemBlock.nextConnection;
        // }

        // And finally we have to return the top-block.
        return topBlock;
    },

    // The container block is the top-block returned by decompose.
    compose: function (topBlock) {
        
        // is the label hidden 
        const labelHidden = topBlock?.getFieldValue('hideLabel')
        if (labelHidden ?? false) {
            this.hideLabel_ = true;
        } else {
            delete this.hideLabel_;
        }



        // // First we get the first sub-block (which represents an input on our main block).
        // var itemBlock = topBlock.getInputTargetBlock('STACK');
        

        // // Then we collect up all of the connections of on our main block that are
        // // referenced by our sub-blocks.
        // // This relates to the saveConnections hook (explained below).
        // var connections = [];
        // while (itemBlock && !itemBlock.isInsertionMarker()) {  // Ignore insertion markers!
        //     connections.push(itemBlock.valueConnection_);
        //     itemBlock = itemBlock.nextConnection &&
        //         itemBlock.nextConnection.targetBlock();
        // }

        // // Then we disconnect any children where the sub-block associated with that
        // // child has been deleted/removed from the stack.
        // for (var i = 0; i < this.itemCount_; i++) {
        //     var connection = this.getInput('ADD' + i).connection.targetConnection;
        //     if (connection && connections.indexOf(connection) == -1) {
        //         connection.disconnect();
        //     }
        // }

        // // Then we update the shape of our block (removing or adding iputs as necessary).
        // // `this` refers to the main block.
        // this.itemCount_ = connections.length;
        // //this.updateShape_();

        // // And finally we reconnect any child blocks.
        // for (var i = 0; i < this.itemCount_; i++) {
        //     connections[i].reconnect(this, 'ADD' + i);
        // }
    },
}, null, ['validation_field_required'])



// class InputField extends FormlyField {
//     constructor(value:any, validator?:any) {
//         super(value, validator);
//     }
//     public static fromJson(options) {
//         const value = utils.parsing.replaceMessageReferences(
//             options['value']);
//         return new InputField(value);
//       };
// }

fieldRegistry.register('formly-field', FormlyField);

export const FROMLY_CUSTOM_BLOCKS_INPUTS: CustomBlock[] = [
    {
        "type": "validation_field_required",
        "message0": "set required",
        "previousStatement": "validation_field",
        "nextStatement": "validation_field",
        "colour": 18,
        "tooltip": "Sets field as required",
        "helpUrl": ""
    },
];


export const FORMLY_CUSTOM_BLOCKS: CustomBlock[] = [
    {
        type: 'form',
        message0: 'Form %1',
        args0: [
            {
                type: "input_statement",
                name: "fields",
                check: "formly_field"
            },
        ]
    },
    {
        "type": "formly_field_settings",
        "message0": "Field Settings \n Hide Label %1 \n Placeholder %2 %3 \n DefaultValue %4 %5 \n Validation %6 \n Properties %7",
        "args0": [
            {
                "type": "field_checkbox",
                "name": "hideLabel",
                "checked": false
            },
            {
                "type": "field_checkbox",
                "name": "enable_placeholder",
                "checked": false
            },
            {
                "type": "field_input",
                "name": "placeholder",
                "text": "placeholder"
            },
            {
                "type": "field_checkbox",
                "name": "enable_default",
                "checked": false
            },
            {
                "type": "field_input",
                "name": "default_value",
                "text": "defaultValue"
            },
            {
                "type": "input_statement",
                "name": "validation_field",
                "check": "validation_field"
            },
            {
                "type": "input_statement",
                "name": "props",
                "check": "props_field"
            }
        ],
        "colour": 15,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        type: "example2",
        message0: "Label %1",
        args0: [
            {
                "type": "field_input",
                "name": "FLYOUT",
            }
        ]
        , mutator: 'FORMLY_FIELD'
    },
    {
        "type": "input",
        "message0": "Input \n Label %1 \n Collect %2 Validation %3",
        "args0": [
            {
                "type": "field_input",
                "name": "label",
                "text": "default"
            } as any,
            {
                "type": "input_value",
                "name": "key",
                "check": [
                    "input_key",
                    "String"
                ]
            },
            {
                "type": "input_statement",
                "name": "validation",
                check: ["validation_field"]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
        , mutator: 'FORMLY_FIELD'
    },
    {
        type: "page",
        message0: "FORM ENTRY %1 Data %2 Do cool stuff %3",
        args0: [
            {
                type: "input_dummy"
            },
            {
                type: "input_statement",
                name: "point",
                check: "manuscript"
            },
            {
                type: "field_checkbox",
                name: "FIELDNAME",
                checked: true
            }
        ],
        colour: 260,
        tooltip: "",
        helpUrl: "",
        previousStatement: null,

    },
    ...FROMLY_CUSTOM_BLOCKS_INPUTS,
]