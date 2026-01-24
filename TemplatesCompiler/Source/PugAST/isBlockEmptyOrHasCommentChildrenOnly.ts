import type PugAST from "./PugAST";
import isAnyTypeOfCommentNode from "./NodeTypesCheckers/isAnyTypeOfCommentNode";


export default function isBlockEmptyOrHasCommentChildrenOnly(pugBlock: PugAST.Block): boolean {

  if (pugBlock.nodes.length === 0) {
    return true;
  }


  for (const node of pugBlock.nodes) {

    if (!isAnyTypeOfCommentNode(node)) {
      return false;
    }

  }

  return true;

}
