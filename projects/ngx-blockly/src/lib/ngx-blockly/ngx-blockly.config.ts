import { InjectionToken } from '@angular/core';
import * as Blockly from 'blockly/core';

// export enum NgxBlocklyGenerator {
//     DART = 'Dart',
//     JAVASCRIPT = 'JavaScript',
//     LUA = 'Lua',
//     PHP = 'PHP',
//     PYTHON = 'Python',
//     XML = 'Xml'
// }

export interface NgxBlocklyConfig extends Blockly.BlocklyOptions {
    defaultBlocks?: boolean;
    generators?: any[]; // NgxBlocklyGenerator[];
    plugins?: { [name: string]: any };
}


export const NGX_CONFIG_TOKEN = new InjectionToken<NgxBlocklyConfig>('config');