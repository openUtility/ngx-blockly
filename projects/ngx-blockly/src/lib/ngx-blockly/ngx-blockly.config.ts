import { InjectionToken } from '@angular/core';
import * as Blockly from 'blockly/core';

export interface NgxBlocklyConfig extends Blockly.BlocklyOptions {
    defaultBlocks?: boolean;
    generators?: any[]; // NgxBlocklyGenerator[];
    plugins?: { [name: string]: any };
}


export const NGX_CONFIG_TOKEN = new InjectionToken<NgxBlocklyConfig>('config');