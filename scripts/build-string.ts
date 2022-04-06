import {
	ts,
	SyntaxKind,
	printNode,
	Node,
	StringLiteral,
	NoSubstitutionTemplateLiteral,
	TemplateHead,
	TemplateMiddle,
	TemplateTail,
} from 'ts-morph';

function tplStringStart(str: string) {
	return printNode(ts.factory.createTemplateHead(str));
}

function tplStringMiddle(str: string) {
	return printNode(ts.factory.createTemplateMiddle(str));
}

function tplStringEnd(str: string) {
	return printNode(ts.factory.createTemplateTail(str));
}

function singleQuote(str: string) {
	return printNode(ts.factory.createStringLiteral(str, true));
}

function isLiteralString(
	node: Node
): node is
	| StringLiteral
	| NoSubstitutionTemplateLiteral
	| TemplateHead
	| TemplateMiddle
	| TemplateTail {
	switch (node.getKind()) {
		case SyntaxKind.NoSubstitutionTemplateLiteral:
		case SyntaxKind.StringLiteral:
		case SyntaxKind.TemplateHead:
		case SyntaxKind.TemplateMiddle:
		case SyntaxKind.TemplateTail:
			return true;
		default:
			return false;
	}
}

function preprocessStringParts(parts: (string | Node)[]) {
	for (let i = 0; i < parts.length; i++) {
		let arg = parts[i];
		if (arg instanceof Node) {
			if (isLiteralString(arg) || Node.isNumericLiteral(arg)) {
				arg = parts[i] = arg.getLiteralText();
			} else if (Node.isTemplateSpan(arg)) {
				parts.splice(i, 1, arg.getExpression(), arg.getLiteral());
				i--;
				continue;
			} else if (Node.isTemplateExpression(arg)) {
				parts.splice(i, 1, arg.getHead(), ...arg.getTemplateSpans());
				i--;
				continue;
			} else if (Node.isParenthesizedExpression(arg)) {
				parts.splice(i, 1, arg.getExpression());
				i--;
				continue;
			} else if (
				Node.isBinaryExpression(arg) &&
				arg.getOperatorToken().getText() === '+' &&
				arg.getType().isString()
			) {
				parts.splice(i, 1, arg.getLeft(), arg.getRight());
				i--;
				continue;
			}
		}
		if (typeof arg === 'string') {
			const previous = parts[i - 1];
			if (typeof previous === 'string') {
				parts[i - 1] = previous + arg;
				arg = '';
			}
			if (arg === '') {
				parts.splice(i, 1);
				i--;
				continue;
			}
		}
	}
}

export function buildString(...args: (string | Node)[]) {
	const parts = args.slice(0);
	preprocessStringParts(parts);
	if (parts.length === 0) {
		return "''";
	}
	if (parts.length === 1 && typeof parts[0] === 'string') {
		return singleQuote(parts[0]);
	}
	if (typeof parts[0] !== 'string') {
		parts.unshift('');
	}
	const output = [tplStringStart(parts.shift() as string)];
	do {
		const curPart = parts.shift();
		output.push((curPart as Node).getText());
		let nextPart = parts[0];
		if (typeof nextPart === 'string') {
			parts.shift();
		} else {
			nextPart = '';
		}
		output.push(
			(parts.length === 0 ? tplStringEnd : tplStringMiddle)(nextPart)
		);
	} while (parts.length > 0);
	return output.join('');
}
