import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { NGX_CONFIG_TOKEN, NgxBlocklyConfig } from './ngx-blockly.config';
// import { CustomBlock } from './models/custom-block';
// import * as Blockly from 'blockly/core';
import { CodeGenerator, WorkspaceSvg, Events } from 'blockly/core';
// import { utils as BlocklyUtils } from 'blockly/core';
// import { Xml as BlocklyXml } from 'blockly/core';
import { BLOCKLY_TOKEN, BLOCKY_CODE_GENERATORS } from './blockly-injection-token';
import { CustomBlock } from './models';
import { extendConfig } from './ngx-blockly-util';

const _defaultConfig: NgxBlocklyConfig = {
  toolbox: {
    // There are two kinds of toolboxes. The simpler one is a flyout toolbox.
    kind: 'flyoutToolbox',
    // The contents is the blocks and other items that exist in your toolbox.
    contents: []
  },
  trashcan: true,
}

@Component({
  selector: 'ngx-blockly',
  standalone: true,
  template: `
  <div id="blockly-wrapper" class="blockly-wrapper">
    <div #primaryContainer class="blockly"></div>
  </div>
  `,
  styles: `
  .blockly-wrapper {
    width: 100%;
    height: 100%;
  }

  .blockly {
    position: absolute;
    width: 100%;
    min-width: 100%;
    height: 100%;
    min-height: 100%;
    z-index: 1;
    &.hidden {
      display: none;
      z-index: 0;
    }
  }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class NgxBlocklyComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private defaultConfig: NgxBlocklyConfig = inject(NGX_CONFIG_TOKEN, { optional: true }) ?? _defaultConfig;
  private blockly = inject(BLOCKLY_TOKEN);
  private codeGenerators?: CodeGenerator | CodeGenerator[] = inject(BLOCKY_CODE_GENERATORS, { optional: true });

  @Input() public config: NgxBlocklyConfig = {};
  @Input() public generators: string | string[] = [];
  @Input() public customBlocks?: {[type: string]: CustomBlock};
  
  @Output() public workspaceChange: EventEmitter<Events.AbstractEventJson> = new EventEmitter<Events.AbstractEventJson>();
  @Output() public toolboxChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() public code = new EventEmitter<{ [key: string]: string }>();
  @Output() public workspaceCreate = new EventEmitter<WorkspaceSvg>();
  
  @ViewChild('primaryContainer') primaryContainer: ElementRef;
  public workspace: WorkspaceSvg;
  private _resizeTimeout;
  private workspaceState = signal<{ loadPending: boolean }>({ loadPending: false });

  ngOnInit() {
  }

  ngAfterViewInit() {
    const passedConfig = extendConfig(this.defaultConfig, this.config);

    // todo: this raises a good question, 
    // should the other items, like mutators and custom generators be generated
    // this way, or directly through blockly... I'll have to think on that...

    if (this.customBlocks) {
      this.blockly.common.defineBlocks(this.customBlocks);
    }
    this.workspace = this.blockly.inject(this.primaryContainer.nativeElement, passedConfig);
    this.workspace.addChangeListener(this._onWorkspaceChange.bind(this));
    this.workspace.fireChangeListener(new this.blockly.Events.FinishedLoading());
    this.workspaceCreate.emit(this.workspace);
    this.resize();

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // skip this if the change comes before we are initialized
    
  }

  ngOnDestroy() {
    if (this.workspace) {
      this.workspace.dispose();
    }
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    clearTimeout(this._resizeTimeout);
    this._resizeTimeout = setTimeout(() => this.resize(), 200);
  }

  /**
   * Generate code for all blocks in the workspace to the specified output.
   * @param workspaceId Workspace to generate code from.
   */
  public workspaceToCode(workspaceId: string) {
    const limitGeneratorsTo = Array.isArray(this.generators) ? [...this.generators] : [this.generators];
    
    if (!this.codeGenerators) {
      return
    }
    const __workspace = this.blockly.Workspace.getById(workspaceId);
    const noFilter = limitGeneratorsTo.length === 0;
    
    if (!Array.isArray(this.codeGenerators)) {
      if (noFilter || this.filterListContainsGenerator(limitGeneratorsTo, this.codeGenerators as CodeGenerator)) {
        this.code.emit({ name: this.codeGenerators.name_ ?? 'Unknown', code: this.codeGenerators.workspaceToCode(__workspace) });
      }
      return;
    }
    let match = false;
    const data = this.codeGenerators.reduce((p, c, i) => {
      if (noFilter || this.filterListContainsGenerator(limitGeneratorsTo, c)) {
        match = true;
        p[c.name_ ?? `Unknown #${i}`] = c.workspaceToCode(__workspace);
      }
      return p;
    }, {});
    
    if (match) {
      this.code.emit(data);
    }
  }

  private filterListContainsGenerator(filterList: string[], codeGen: CodeGenerator): boolean {
    return filterList.findIndex(fl => this.isGenerartorByName(codeGen, fl)) > -1;
  }

  private isGenerartorByName(codeGen: CodeGenerator, name: string): boolean {
    return (codeGen.name_ ?? 'unknown').toLowerCase() === name.toLowerCase();
  }

  /**
   * Dispose of all blocks in workspace, with an optimization to prevent resizes.
   */
  public clear() {
    if (this.workspace) {
      this.workspace.clear();
    }
  }

  /**
   * Clear the undo/redo stacks.
   */
  public clearUndo() {
    if (this.workspace) {
      this.workspace.clearUndo();
    }
  }

  /**
   * Clear the reference to the current gesture.
   */
  public clearGesture() {
    if (this.workspace) {
      this.workspace.clearGesture();
    }
  }


  /**
   * Size the workspace when the contents change. This also updates
   * scrollbars accordingly.
   */
  public resize() {
    if (this.workspace) {
      this.blockly.svgResize(this.workspace);
    }
    
  }

  public highlightBlock(blockId: string) {
    if (this.workspace) {
      this.workspace.highlightBlock(blockId);
    }
    
  }

  private _onWorkspaceChange(event: any) {
    this.workspaceChange.emit(event);
    if (event.type === Events.FINISHED_LOADING) {
      this.workspaceState.update(f => ({...f, loadPending: false}));
    }
    if (!this.workspaceState().loadPending) {
      if (event instanceof Events.BlockBase ||
        event instanceof Events.VarBase ||
        event instanceof Events.CommentBase) {
        this.workspaceToCode(event.workspaceId);
      }
      if (event.type === Events.TOOLBOX_ITEM_SELECT) {
        this.toolboxChange.emit(event);
      }
      
    }
  }
}
