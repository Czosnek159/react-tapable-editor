import blockMutationUtil from "./blockMutationUtil";
import blockUtil from "./blockUtil";
import { List } from "immutable";

function insertBlockBefore(blockMap, targetBlock, sourceBlock) {
  const blocksBefore = blockUtil.blocksBefore(blockMap, targetBlock);
  const blocksAfter = blockUtil.blocksAfter(blockMap, targetBlock);
  const sourceBlockKey = sourceBlock.getKey();
  const targetBlockKey = targetBlock.getKey();
  const targetParentKey = targetBlock.parent;

  const newBlockMap = blocksBefore
    .concat([
      [sourceBlockKey, sourceBlock],
      [targetBlockKey, targetBlock]
    ])
    .concat(blocksAfter)
    .toOrderedMap();

  return newBlockMap.withMutations(function(blocks) {
    blockMutationUtil.transformBlock(sourceBlockKey, blocks, function(block) {
      return block.merge({
        prevSibling: targetBlock.getPrevSiblingKey(),
        nextSibling: targetBlockKey
      });
    });

    blockMutationUtil.transformBlock(targetBlockKey, blocks, function(block) {
      return block.merge({
        prevSibling: sourceBlockKey
      });
    });

    blockMutationUtil.transformBlock(targetParentKey, blocks, function(block) {
      const parentChildrenList = block.getChildKeys();
      const newChildrenArray = parentChildrenList.toArray();
      const index = newChildrenArray.indexOf(targetBlockKey);
      newChildrenArray.splice(index, 0, sourceBlockKey);

      return block.merge({
        children: List(newChildrenArray)
      });
    });
  });
}

export default insertBlockBefore;
