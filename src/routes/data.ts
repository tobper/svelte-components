import { create_normalized_lookup, seconds } from '$lib';

export const fruits = [
	'Apple',
	'Apricot',
	'Avocado',
	'Banana',
	'Blackberry',
	'Blueberry',
	'Cherry',
	'Grape',
	'Grapefruit',
	'Guava',
	'Kiwi',
	'Lemon',
	'Lime',
	'Mango',
	'Mangosteen',
	'Orange',
	'Papaya',
	'Peach',
	'Pear',
	'Pineapple',
	'Plum',
	'Pomegranate',
	'Strawberry',
	'Watermelon',
];

export const vegetables = [
	'Artichoke',
	'Ash gourd',
	'Asparagus',
	'Beetroot',
	'Bell pepper',
	'Bitter gourd',
	'Broccoli',
	'Cabbage',
	'Carrot',
	'Carry',
	'Cauliflower',
	'Celery',
	'Chayote',
	'Collard greens',
	'Coriander',
	'Corn',
	'Dill',
	'Eggplant',
	'Endive',
	'Fennel',
	'Garlic',
	'Ginger',
	'Green bean',
	'Green chilies',
	'Green plantain',
	'Horseradish',
	'Kohlrabi',
];

export const food = [
	...fruits.map(name => ({ type: 'Fruit', name })),
	...vegetables.map(name => ({ type: 'Vegetable', name })),
];

export type Food = typeof food[number];

const fruit_lookup = create_normalized_lookup(fruits);

export async function find_fruit(query: string) {
	await new Promise(r => setTimeout(r, Math.random() * seconds(.25)))

	return fruit_lookup.find_all(query);
}

export function get_food_heading(food: Food) {
	return `${food.type}s`;
}

export function random<T>(items: T[], count: number) {
	if (count > items.length)
		count = items.length;

	const result = Array.from(items);

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result.slice(0, count);
}


/* spellchecker:disable */
export const lorem =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum magna ac orci convallis, ' +
	'vel scelerisque metus tempus. Proin sed libero bibendum, congue justo interdum, bibendum nisl. ' +
	'Duis ut arcu sed elit congue vehicula id non metus. Mauris justo purus, congue eu fermentum ' +
	'gravida, mollis vel lorem. Etiam nisi massa, tristique quis urna nec, rutrum suscipit turpis. Ut ' +
	'at orci nec ex laoreet feugiat nec efficitur felis. Duis consequat augue vel ante elementum ' +
	'tincidunt. Vestibulum quis interdum lectus, non porttitor lacus. Nullam orci erat, maximus non ' +
	'dui sit amet, finibus semper lacus. Aenean molestie vulputate scelerisque. Donec molestie iaculis ' +
	'velit, at auctor purus porttitor eget. Nunc neque neque, interdum nec nulla eget, elementum mattis ' +
	'enim. Donec id luctus ante, id fermentum lacus.'
/* spellchecker:enable */
