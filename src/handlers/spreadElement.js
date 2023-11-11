import { hasBoundaries, isCallExpressionWithIdentifier, isIdentifier, isObjectExpression, isProperty } from "../utils.js";

/**
 * 
 * @param {import('estree').SpreadElement & import('../nodes').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function spreadElementHandler(node, magic, options){
    if (
        isCallExpressionWithIdentifier(node.argument, '$get')
    ) {
        let nodeToReplace = node;
        let callExpression = node.argument;
        let [gettersNode] = callExpression.arguments;
        let props = [];
        if (isObjectExpression(gettersNode)) {
            gettersNode.properties.forEach((prop) => {
                if (
                    isProperty(prop) &&
                    isIdentifier(prop.key) &&
                    isIdentifier(prop.value) &&
                    prop.key.name === prop.value.name
                ) {
                    props.push(
                        `get ${prop.key.name}() { return ${prop.key.name}; }`,
                    );
                }
            });
        }
        let replacementString = props.join(',\n');
        if (hasBoundaries(nodeToReplace)) {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                replacementString,
            );
        }
    }

    if (
        isCallExpressionWithIdentifier(node.argument, '$set')
    ) {
        let nodeToReplace = node;
        let callExpression = node.argument;
        let [settersNode] = callExpression.arguments;
        let props = [];
        if (isObjectExpression(settersNode)) {
            settersNode.properties.forEach((prop) => {
                if (
                    isProperty(prop) &&
                    isIdentifier(prop.key) &&
                    isIdentifier(prop.value) &&
                    prop.key.name === prop.value.name
                ) {
                    props.push(
                        `set ${prop.key.name}(value) { ${prop.key.name} = value; }`,
                    );
                }
            });
        }
        let replacementString = props.join(',\n');
        if (hasBoundaries(nodeToReplace)) {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                replacementString,
            );
        }
    }

    if (
        isCallExpressionWithIdentifier(node.argument, '$getset')
    ) {
        let nodeToReplace = node;
        let callExpression = node.argument;
        let [gettersNode] = callExpression.arguments;
        let props = [];
        if (isObjectExpression(gettersNode)) {
            gettersNode.properties.forEach((prop) => {
                if (
                    isProperty(prop) &&
                    isIdentifier(prop.key) &&
                    isIdentifier(prop.value) &&
                    prop.key.name === prop.value.name
                ) {
                    props.push(
                        `get ${prop.key.name}() { return ${prop.key.name}; }`,
                    );
                    props.push(
                        `set ${prop.key.name}(value) { ${prop.key.name} = value; }`,
                    );
                }
            });
        }
        let replacementString = props.join(',\n');
        if (hasBoundaries(nodeToReplace)) {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                replacementString,
            );
        }
    }
}