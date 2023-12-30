import { common } from 'blockly/core';
import { CustomBlock } from './models/custom-block';
import { NgxBlocklyConfig } from './ngx-blockly.config';

export function JSONToBlockDefinition<T = any | CustomBlock>(blocks: T[]): {[type: string]: T} {
    return common.createBlockDefinitionsFromJsonArray(blocks);
}

// extend all the content
export function extendConfig(...configs: NgxBlocklyConfig[]): NgxBlocklyConfig {
    const extentObject = (a, b) => {
        const rtnObj = { ...a, ...b };
        const aKeys = Object.keys(a);
        aKeys.filter(ax => typeof a[ax] === 'object' && ax in b).forEach((ax) => {
            if (Array.isArray(a[ax]) && Array.isArray(b[ax])) {
                rtnObj[ax] = [...a[ax], ...b[ax]];
            } else if (!Array.isArray(a[ax]) && !Array.isArray(b[ax])) {
                rtnObj[ax] = extentObject(a[ax], b[ax]);
            }
            
        })
        return rtnObj;
    }

    return configs.reduce((p, c) => extentObject(p, c), {});
}