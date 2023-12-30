import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
    CustomBlock,
    JSONToBlockDefinition,
    NgxBlocklyComponent,
    NgxBlocklyConfig
    // Blockly
} from '@openUtility/ngx-blockly';
// import { ExampleBlock } from './blocks/example.block';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    public readOnly = false;

    public customBlocks: CustomBlock[] = [
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
            
        }
    ];
    
    public config: NgxBlocklyConfig = {
        defaultBlocks: true,
        toolbox: {
            contents: [
                {
                    "kind": "block",
                    "type": "page"
                  },
            ]
        }
    }
    public get blocks() {
        return JSONToBlockDefinition(this.customBlocks);
    }


    @ViewChild('blockly') blocklyComponent: NgxBlocklyComponent;

    constructor() {
        
    }

    ngAfterViewInit(): void {

    }

    onCode(code: string) {
        console.log(code);
    }
}
