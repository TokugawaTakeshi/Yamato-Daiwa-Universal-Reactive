import PugAST from "./PugAST";


export default function isConditionalPugNode(pugNode: PugAST.Node): pugNode is PugAST.Conditional {
  return pugNode.type === PugAST.NodeTypes.conditional;
}
