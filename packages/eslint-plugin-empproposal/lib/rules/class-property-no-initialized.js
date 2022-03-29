module.exports = {
  meta: {
    docs: {
      description: 'disallow uninitialized class property and is not definitely assigned in the constructor',
      category: 'ECMAScript 6',
      recommended: false,
      url: 'https://emp.yy.com'
    },
    schema: [],
    messages: {
      unexpected: 'emplint: \'{{name}}\' has no initializer and is not definitely assigned in the constructor。'
    }
  },

  create(context) {
    /**
       * report error
       * @param node
       */
    function report(node) {
      context.report({
        messageId: 'unexpected',
        data: {
          name: node.key.name
        },
        node
      });
    }

    return {
      ClassDeclaration(node) {
        // console.log('##:', node.body.body);
        // const constructorAssignValue = [];
        const warnNodeMap = {};
        let constructorNodeBody = null;
        if (node.body && node.body.body) {
          node.body.body.forEach(item => {
            // console.log('item type', item.type);
            if (item.type === 'ClassProperty') {
              if (item.value === null) {
                // console.log('#item:', item);
                warnNodeMap[item.key.name] = item;
              }
            }

            if (item.type === 'MethodDefinition' && item.kind === 'constructor') {
              constructorNodeBody = item.value.body.body;
            }
          });
          //   console.log('propertyWithNoValue', propertyWithNoValue);
          //   console.log('constructorNode', constructorNodeBody);
          if (constructorNodeBody) {
            constructorNodeBody.forEach(item => {
            //   console.log('##type', item.type);
            //   console.log('##expression', item.expression);
              if (item.type === 'ExpressionStatement' && item.expression.type === 'AssignmentExpression') {
                // console.log('##left', item.expression.left.property.name);
                if (item.expression.left.property.name) {
                //   constructorAssignValue.push(item.expression.left.property.name);
                  delete warnNodeMap[item.expression.left.property.name];
                }
              }
            });
          }
        }
        // console.log('warnNodeMap', warnNodeMap);
        // console.log('constructorAssignValue', constructorAssignValue);
        Object.values(warnNodeMap).forEach(itemNode => {
          // console.log('report itemNode', itemNode.key.name);
          report(itemNode);
        });
      }
    };
  }
};
