import type { TransitionConfig } from 'svelte/transition';
import { no_transition, slide_fast } from './transitions';

export type Transition = (node: Element) => TransitionConfig
export type TransitionValue =
	| boolean
	| 'slide'
	| Transition

export function getTransition(transition?: TransitionValue): Transition {
	if (transition === true)
		return slide_fast;

	if (transition === 'slide')
		return slide_fast;

	if (transition)
		return transition;

	return no_transition;
}
