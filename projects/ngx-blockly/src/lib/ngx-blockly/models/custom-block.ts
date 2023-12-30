import { BlockDefinition } from "blockly/core/blocks";

export interface BlockArguments {
    /** The type specifies the kind of input or field to be inserted. */
    type: string;
    /** The name allows you to reference the field and get its value. */
    name?: string;

    options?: [string, string];

    align?: 'RIGHT' | 'LEFT';
    /** ??? not sure what this was... */
    check?: string;

    variable?: string,
    variableTypes?: string[];

    checked?: boolean;
}

export interface CustomBlock extends BlockDefinition {
    /**
     * The type is like the "class name" for your block. It is used to construct
     * new instances. E.g. in the toolbox.
     */
    type: string;

    /**
     * The message defines the basic text of your block, and where inputs or
     * fields will be inserted.
     */
    message0?: string;

    /**
     * Each arg is associated with a %# in the message.
     * This one gets substituted for %1.
     */
    args0?: BlockArguments[];

    /** 
     * Adds an untyped previous connection to the top of the block.
     * AKA: list of types this can be attached to 
     */
    previousStatement?: string | string[];
    /** 
     * Adds an untyped next connection to the bottom of the block.
     * AKA list of types that can attached to this
     */
    nextStatement?: string | string[];


    output?: string;
    colour?: number;
    tooltip?: string;
    helpUrl?: string;
}