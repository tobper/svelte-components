import { BROWSER } from 'esm-env';
import { onMount } from 'svelte';

export function media_query(query: string) {
	if (!BROWSER)
		return { value: false };

	const query_list = window.matchMedia(query);

	let value = $state(query_list.matches);

	query_list.addEventListener('change', ({ matches }) => value = matches);

	return {
		get value() { return value; }
	}
}

export function media_queries<T extends { [key: string]: string; }>(queries: T): { [K in keyof T]: boolean; } {
	const values =
		$state(
			Object.fromEntries(
				Object
					.keys(queries)
					.map(key => ([key, false]))
			)
		);

	onMount(() => {
		const lists = Object
			.entries(queries)
			.map(([key, query]) => {
				const query_list = window.matchMedia(query);
				const onchange= ({ matches }: MediaQueryListEvent) => values[key] = matches;

				return {
					key,
					matches: query_list.matches,
					add_event_listener: () => query_list.addEventListener('change', onchange),
					remove_event_listener: () => query_list.removeEventListener('change', onchange),
				}
			});

		for (const { key, matches, add_event_listener } of lists) {
			values[key] = matches;
			add_event_listener();
		}

		return () => {
			for (const { remove_event_listener } of lists) {
				remove_event_listener();
			}
		}
	});

	return values as { [K in keyof T]: boolean; };
}
