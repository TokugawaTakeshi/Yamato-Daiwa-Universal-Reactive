import PugAST from "./PugAST";


export default function isCodePugNode(pugNode: PugAST.Node): pugNode is PugAST.Code {
  return pugNode.type === PugAST.NodeTypes.code;
}
