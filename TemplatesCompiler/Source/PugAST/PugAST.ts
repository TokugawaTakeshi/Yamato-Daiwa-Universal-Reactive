/** @see https://github.com/pugjs/pug-ast-spec/blob/master/parser.md */
namespace PugAST {

  export enum NodeTypes {
    block = "Block",
    tag = "Tag",
    code = "Code",
    text = "Text"
  }

  export type Node = {

    type: NodeTypes;

    /** @description Line number of the start position of the node */
    line: number;

    /** @description Column number at the starting position of the node */
    column?: number;

    /** @description The name of the file the node originally belongs to */
    filename?: string;

  };

  /** @description Generic container of Nodes. */
  export type Block =

      Node &

      {
        type: NodeTypes.block;
        nodes: Array<Node>;
      };


  /* ━━━ Abstract Node Types ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type AttributedNode =

      Node &

      {

        /** @description all the individual attributes of the node */
        attrs: Array<Attribute>;

        /** @description all the &attributes expressions effective on this node */
        attributeBlocks: Array<string>;

      };

  export type BlockNode =

      Node &

      {
        block?: Block;
      };

  export type ValueNode =

      Node &

      {
        val: string;
      };

  export type Attribute = {

    /** @description The name of the attribute */
    name: string;

    /** @description JavaScript expression returning the value of the attribute */
    val: string;

    /** @description If the value must be HTML-escaped before being buffered */
    mustEscape: boolean;

  };


  /* ━━━ Tags ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type CommonTag =

      AttributedNode &

      BlockNode &

      {
        selfClosing: boolean;
        isInline: boolean;
      };

  export type Tag =

      CommonTag &

      {
        type: NodeTypes.tag;
        name: string;
      };


  /* ━━━ Text ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Text =

      ValueNode &

      { type: NodeTypes.text; };


  /* ━━━ Code ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Code =

      BlockNode &

      ValueNode &

      {

        type: NodeTypes.code;

        /** @description If the value of the piece of code is buffered in the template */
        buffer: boolean;

        /** @description If the value must be HTML-escaped before being buffered */
        mustEscape: boolean;

        /** @description Whether the node is the result of a string interpolation */
        isInline: boolean;

      };

}


export default PugAST;
