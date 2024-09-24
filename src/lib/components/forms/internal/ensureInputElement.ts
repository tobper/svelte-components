export function ensureHtmlInputElement(element: unknown): HTMLInputElement {
	return ensureElement(element, HTMLInputElement);
}

export function ensureElement<T extends Element>(
	element: unknown,
	type: { new(...args: []): T }
): T {
	if (element instanceof type)
	  return element;
 
	throw new Error(`Element is not of type ${type.name}`);
}
