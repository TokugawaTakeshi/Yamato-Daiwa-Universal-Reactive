import PugAST from "../PugAST";


export default function isAnyTypeOfCommentNode(pugNode: PugAST.Node): pugNode is PugAST.SingleLineComment | PugAST.BlockComment {
  return pugNode.type === PugAST.NodeTypes.singleLineComment || pugNode.type === PugAST.NodeTypes.blockComment;
}
