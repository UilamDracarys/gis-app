// types/feature.ts
export interface Feature {
	id: number;
	name: string;
    geom: string;
    style: object;
	// add fields based on your Django serializer
}