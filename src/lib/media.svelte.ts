import { BROWSER } from 'esm-env';

export function media_queries<
	T extends { [key: string]: string; }
>(
	queries: T,
	on_destroy?: (callback: () => void) => void
): { [K in keyof T]: boolean; } {
	const values = $state(
		Object.fromEntries(
			Object.keys(queries).map(key => ([key, false]))
		)
	) as { [K in keyof T]: boolean; };

	if (BROWSER) {
		for (const key in queries) {
			const query_list = window.matchMedia(queries[key]);
			const onchange= ({ matches }: MediaQueryListEvent) => values[key] = matches;
			
			values[key] = query_list.matches;
			query_list.addEventListener('change', onchange);

			if (on_destroy) {
				on_destroy(() => {
					query_list.removeEventListener('change', onchange);
				});
			}
		}
	}

	return values;
}
