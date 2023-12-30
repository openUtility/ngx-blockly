/*
 * Public API Surface of ngx-blockly
 */
// import * as Blockly from 'blockly/core';
import { setLocale } from 'blockly/core';

//export { Blockly };

// Locales
import * as EN from 'blockly/msg/en';

setLocale(EN);

export * from './lib/ngx-blockly/ngx-blockly.component';
export * from './lib/ngx-blockly/ngx-blockly.config';
export * from './lib/ngx-blockly/models';
export * from './lib/ngx-blockly/ngx-blockly-util';

export { BLOCKY_CODE_GENERATORS } from './lib/ngx-blockly/blockly-injection-token'


// export * from './lib/ngx-blockly.module';










