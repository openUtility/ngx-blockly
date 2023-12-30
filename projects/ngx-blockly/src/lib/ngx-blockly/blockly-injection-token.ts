import { InjectionToken } from "@angular/core";
import * as Blockly from 'blockly/core';

export interface BlocklyInterface {
    [key: string]: any
}

export const BLOCKLY_TOKEN = new InjectionToken<BlocklyInterface>(
    'Blockly core object',
    {
        factory: () => {
            return Blockly;
        }
    }
);

export const BLOCKY_CODE_GENERATORS = new InjectionToken<Blockly.CodeGenerator>('code generator');
