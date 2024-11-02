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
	await new Promise(r => setTimeout(r, Math.random() * seconds(1)))

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
