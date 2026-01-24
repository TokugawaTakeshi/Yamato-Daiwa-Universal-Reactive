import PugAST from "../PugAST";


export default function isTagPugNode(pugNode: PugAST.Node): pugNode is PugAST.Tag {
  return pugNode.type === PugAST.NodeTypes.tag;
}
