import 'blockly/blocks';
import { Component, ViewChild, computed, inject, signal, untracked } from '@angular/core';
import {
  CustomBlock,
  JSONToBlockDefinition,
  NgxBlocklyComponent,
  NgxBlocklyConfig
  // Blockly
} from '@openUtility/ngx-blockly';
import { CommonModule } from '@angular/common';
import { BLOCKLY_GENERATORS } from './blockly-page.setup';
import { FORMLY_CUSTOM_BLOCKS } from './blockly-custom-blocks';
import { FormConfigService } from './form-config.service';
import { WorkspaceSvg } from 'blockly';
import { BlockSvg, RenderedConnection, utils } from 'blockly/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-blockly-page',
  standalone: true,
  imports: [
    CommonModule,
    NgxBlocklyComponent,
  ],
  providers: [
    BLOCKLY_GENERATORS
  ],
  template: `
  <ngx-blockly
      #blockly
      [config]="config"
      generators="FORMLY_FIELD_CONFIG"
      [customBlocks]="blocks()"
      (code)="onCode($event)"
      (workspaceCreate)="onLoad($event)"
      >
    </ngx-blockly>
  `,
  styles: ``
})
export class BlocklyPageComponent {
  public readOnly = false;
  private formSrv = inject(FormConfigService);
  private firstLoad = false;

  private customBlocks = signal<CustomBlock[]>(FORMLY_CUSTOM_BLOCKS)

  public blocks = computed(() => {
    const customBlocks = this.customBlocks();
    return untracked(() => {
      return JSONToBlockDefinition(customBlocks);
    })
  })

  public config: NgxBlocklyConfig = {
    defaultBlocks: false,
    toolbox: {
      kind: 'categoryToolbox',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'validation_field_required', },
        { 
          kind: 'category',
          name: 'Fields',
          contents: [
            {
              kind: 'block',
              type: 'controls_if'
            },
            {
              kind: 'block',
              type: 'controls_whileUntil'
            },
            {
              "kind": "block",
              "type": "input"
            },
            {
              "kind": "block",
              "type": "example2"
            },
          ],
          collapsed: false,
        }, 
        { 
          id: 'input_list',
          kind: 'category',
          name: "Inputs", 
          enabled: true,
          contents: [
            { kind: 'block', type: 'text'}
          ]
        }, 
        {
          kind: 'category',
          name: 'Validators',
          enabled: true,
          contents: [
            {
              "kind": "block",
              "type": "validation_field_required",
            }
          ]
        }
      ]
    }
  }



  @ViewChild('blockly') blocklyComponent: NgxBlocklyComponent;


  processBlock(workspaceSvg: WorkspaceSvg, field: FormlyFieldConfig): BlockSvg {
    const blockObject = workspaceSvg.newBlock(field.type as string);
    blockObject.initSvg();
    blockObject.render();
    if (field.key) {
      const keyObj = workspaceSvg.newBlock('text');
      keyObj.initSvg();
      keyObj.render();
      keyObj.setFieldValue(field.key, 'TEXT');
      blockObject.getInput('key').connection.connect(keyObj.outputConnection);
    }
    if (field.props) {
      if (field.props.label) {
        blockObject.setFieldValue(field.props.label, 'label');
      }
      if (field.props.required) {
        const isRequiredObj = workspaceSvg.newBlock('validation_field_required');
        isRequiredObj.initSvg();
        isRequiredObj.render();
        blockObject.getInput('validation').connection.connect(isRequiredObj.previousConnection);
      }
    }
    return blockObject
  }

  onLoad(workspaceSvg: WorkspaceSvg): void {
    const intialForm = this.formSrv.formlyFieldConfig();
    const pageObj = workspaceSvg.newBlock('form');
    pageObj.initSvg();
    pageObj.render();
    pageObj.setDeletable(false);
    pageObj.moveTo(new utils.Coordinate(5, 5), ['initial_load']);
    
    /// loop over the array and add the items...
    if (intialForm.length > 0) {
      const poc = pageObj.getInput('fields').connection;
      intialForm.map(f => this.processBlock(workspaceSvg, f))
        .reverse() // we need to reverse orelse it builds backwords.
        .forEach(b => poc.connect(b.previousConnection));
      
    }

    this.firstLoad = true;
  }

  onCode(code: { [key: string]: string }) {
    console.log(code, this.firstLoad);
    if (!this.firstLoad) return;
    try {
      const config = JSON.parse(code['FORMLY_FIELD_CONFIG']);
      if (Array.isArray(config)) {
        this.formSrv.formlyFieldConfig.set(config)  
      } else {
        this.formSrv.formlyFieldConfig.set([config])
      }
      
    } catch (ex: unknown) {
      console.error("Unable to parse", ex);
    }
    
  }
}
