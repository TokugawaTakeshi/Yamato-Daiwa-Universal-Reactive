import PugAST from "../PugAST";


export default function isTextPugNode(pugNode: PugAST.Node): pugNode is PugAST.Text {
  return pugNode.type === PugAST.NodeTypes.text;
}
