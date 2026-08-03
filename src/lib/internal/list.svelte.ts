import { normalize } from '$lib/normalization';
import { unique_id } from '$lib/unique_id';
import type { Component, Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { hash } from './hash';

export type ListItem<T> =
	| Heading
	| Option<T>
	| Separator
	| Text;

export interface Heading {
	type: 'heading';
	id: string;
	indent: number;
	label: string;
	handlers?: Attachment<HTMLElement>;
}

export interface Option<T> {
	type: 'option';
	indent: number;
	id: string;
	icon?: Component | Snippet;
	kbd?: string | string[];
	details?: string;
	value: string;
	option: T;
	handlers?: Attachment<HTMLElement>;
}

export interface Separator {
	type: 'separator';
	id: string;
	indent: number;
	handlers?: Attachment<HTMLElement>;
}

export interface Text {
	type: 'text';
	id: string;
	indent: number;
	text: string;
	handlers?: Attachment<HTMLElement>;
}

interface MappedOption<T> {
	option: T;
	heading?: string;
	children: MappedOption<T>[];
	list_item: Option<T>;
	search_terms: string[];
}

export function find_options<T>(
	options: MappedOption<T>[],
	query: string
) {
	const query_words = normalize(query).split(' ');
	const matches = find(options, query_words);

	return matches;

	function find(options: MappedOption<T>[], query_words: string[]): MappedOption<T>[] {
		return options.flatMap<MappedOption<T>>(option => {
			// Remove query words matching current item
			const non_matched_words = query_words.filter(
				query_word => !option.search_terms.some(
					term => term.startsWith(query_word)
				)
			);

			// Item matches all remaining query words, return as is with all children
			if (non_matched_words.length === 0)
				return [option];

			// At least one child matches remaining query words, return item with matching children
			const children = find(option.children, non_matched_words) ?? [];
			if (children.length > 0)
				return [{ ...option, children }];

			// Item or children does not match remaining query words
			return [];
		});
	}
}

export function map_list_options<T>(
	list_id: string,
	options: T[],
	option_value?: (option: T) => string,
	option_heading?: (option: T) => string | undefined,
	option_icon?: (option: T) => Component | Snippet,
	option_kbd?: (option: T) => string | string[] | undefined,
	option_details?: (option: T) => string | undefined,
	option_children?: (option: T) => T[] | undefined,
) {
	const used_ids = new Set<string>();

	return map(options);

	function map(
		options: T[] = [],
		indent = 0,
		parent_id = ''
	): [mapped_options: MappedOption<T>[], count: number] {
		const mapped_options: MappedOption<T>[] = [];
		let count = 0;

		for (const option of options) {
			const
				heading = option_heading?.(option),
				icon = option_icon?.(option),
				kbd = option_kbd?.(option),
				value = option_value?.(option) ?? `${option}`,
				details = option_details?.(option),
				id = calculate_id(parent_id, heading, details, value),
				[children, child_count] = map(option_children?.(option), indent + 1, id);

			const list_item: Option<T> = { type: 'option', indent, id, icon, kbd, details, value, option };
			const search_terms = normalize(value).split(' ');

			mapped_options.push({ option, heading, children, list_item, search_terms });
			count += 1 + child_count;
		}

		return [mapped_options, count];
	}

	function calculate_id(...values: (string | number | null | undefined)[]) {
		let id = `${list_id}_${hash(values)}`;

		if (used_ids.has(id))
			id = calculate_id(...values, unique_id());

		used_ids.add(id);

		return id;
	}
}

export function create_list_items<T>(
	options: MappedOption<T>[],
	empty_text?: string,
) {
	const list_items: ListItem<T>[] = [];

	add_options(options);

	if (list_items.length === 0 && empty_text)
		add_text(0, empty_text);

	return list_items;

	function add_options(options: MappedOption<T>[]) {
		const headings = new Map<string, [MappedOption<T>, ...MappedOption<T>[]]>();

		for (const mapped_option of options) {
			const { heading, children, list_item } = mapped_option;

			if (heading) {
				const heading_items = headings.get(heading);
				if (heading_items)
					heading_items.push(mapped_option);
				else
					headings.set(heading, [mapped_option]);
			}
			else {
				add_option(list_item);
				add_options(children);
			}
		}

		const sorted_headings = headings
			.entries()
			.toArray()
			.sort(([x_label], [y_label]) => x_label.localeCompare(y_label));

		for (const [label, heading_options] of sorted_headings) {
			const { indent } = heading_options[0].list_item;

			if (list_items.length > 0)
				add_separator(indent);

			add_heading(indent, label);

			for (const { list_item, children } of heading_options) {
				add_option(list_item);
				add_options(children);
			}
		}
	}

	function add_heading(indent: number, label: string) {
		list_items.push({ type: 'heading', id: unique_id(), indent, label });
	}

	function add_option(list_item: Option<T>) {
		list_items.push(list_item);
	}

	function add_separator(indent: number) {
		list_items.push({ type: 'separator', id: unique_id(), indent });
	}

	function add_text(indent: number, text: string) {
		list_items.push({ type: 'text', id: unique_id(), indent, text });
	}
}
