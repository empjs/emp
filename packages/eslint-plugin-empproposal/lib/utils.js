// utils

/**
 * Check if the expression returns an array
 * @param node
 * @return {boolean}
 */
exports.isArrayGenerator = function (node) {
  if (!node) return false;

  if (node.type === 'ArrayExpression') {
    return true;
  }
  if (node.type === 'NewExpression' && node.callee.name === 'Array') {
    return true;
  }
  if (node.type === 'CallExpression' && node.callee.name === 'Array') {
    return true;
  }

  return false;
};
