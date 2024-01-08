import { ArrowFunctionExpression, FunctionExpression, CallExpression, Identifier, Node, ObjectExpression, Property, SpreadElement, VariableDeclaration } from "estree";
type NodeExtension = { start?: number, end?: number }
export type ExtendedNode = Node & NodeExtension

export type IsNodeFn = (node?: Node | null) => node is Node & NodeExtension
export type IsSpreadElementFn = (node?: Node | null) => node is SpreadElement & NodeExtension
export type IsVariableDeclarationFn = (node?: Node | null) => node is VariableDeclaration & NodeExtension
export type IsCallExpressionFn = (node?: Node | null) => node is CallExpression & NodeExtension
export type IsArrowFunctionExpression = (node?: Node | null) => node is ArrowFunctionExpression
export type IsFunctionExpression = (node?: Node | null) => node is FunctionExpression
export type IsAnyFunctionExpression = (node?: Node | null) => node is (FunctionExpression | ArrowFunctionExpression) & NodeExtension
export type IsCallExpressionWithIdentifier = (node: Node | null | undefined, name: string) => node is CallExpression
export type IsIdentifierFn = (node?: Node | null) => node is Identifier & NodeExtension
export type IsObjectExpressionFn = (node?: Node | null) => node is ObjectExpression & NodeExtension
export type IsPropertyFn = (node?: Node | null) => node is Property & NodeExtension
export type HasBoundariesFn = <T extends ExtendedNode>(node: T) => node is T & { start: number, end: number }
