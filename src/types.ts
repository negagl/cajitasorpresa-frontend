export interface Box {
	id: number;
	nombre: string;
	descripcion: string;
	precio_base: number;
	imagen: string;
	ingredientes: Ingrediente[];
}

export interface Ingrediente {
	id: number;
	nombre: string;
	box_id: number;
	cantidad: number;
	unidad_de_medida: string;
}

export interface Extra {
	id: number;
	nombre: string;
	tipo: "complemento" | "adicional";
	descripcion: string;
	precio_base: number;
}

export interface ApiResponse<T> {
	data: T;
}
