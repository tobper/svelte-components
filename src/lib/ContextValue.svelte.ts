export class ContextValue<T> {
	#values = $state<{ value: T }[]>([]);

	get current() {
		return this.#values.at(-1)?.value;
	}

	set(value: T) {
		const box = { value };

		this.#values.push(box);

		return () => {
			const index = this.#values.indexOf(box);
			if (index !== -1)
				this.#values.splice(index, 1);
		}
	}
}
