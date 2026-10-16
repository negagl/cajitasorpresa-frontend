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

export interface ExtraInput {
	extra_id: number;
	cantidad: number;
}

export interface PersonalizacionInput {
	categoria: string;
	eleccion: string;
}

export interface CrearPedidoInput {
	nombre_cliente: string;
	telefono_cliente: string;
	box_id?: number;
	sabor_jugo?: string;
	con_azucar?: boolean;
	mensaje_tarjeta?: string;
	foto_url?: string;
	fecha_entrega: string;
	extras?: ExtraInput[];
	personalizacion?: PersonalizacionInput[];
}

export interface ItemExtraPedido {
	id: number;
	pedido_id: number;
	extra_id: number;
	extra: Extra;
	cantidad: number;
}

export interface PedidoAdmin {
	id: number;
	nombre_cliente: string;
	telefono_cliente: string;
	box_id?: number;
	sabor_jugo?: string;
	con_azucar?: boolean;
	mensaje_tarjeta?: string;
	foto_url?: string;
	items_extra: ItemExtraPedido[];
	personalizacion: PersonalizacionInput[];
	precio_total: number;
	fecha_pedido: string;
	fecha_entrega: string;
	estado: "pendiente" | "en proceso" | "entregado";
}