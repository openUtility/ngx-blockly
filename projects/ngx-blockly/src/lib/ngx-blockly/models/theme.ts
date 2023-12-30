import { Theme as BlocklyTheme } from 'blockly/core';

export class Theme {
    constructor(private name: string,
                private blockStyles: BlockStyles,
                private categoryStyles: CategoryStyles,
                private componentStyle: BlocklyTheme.ComponentStyle) {
    }

    createBlocklyTheme(): any {
        return new BlocklyTheme(this.name, this.blockStyles, this.categoryStyles, this.componentStyle);
    }
}

export interface BlockStyles {
    [blockStyleName: string]: BlocklyTheme.BlockStyle;
}

export interface CategoryStyles {
    [categoryStyleName: string]: BlocklyTheme.CategoryStyle;
}


export class BlockStyle {
    colourPrimary: string;
    colourSecondary: string;
    colourTertiary: string;
    hat: string;
}
