import { useEffect, useState } from "react";
import type { Box, PedidoAdmin } from "../../types";
import { fetchJson } from "../../utils/api";
import { formatCOP, formatFecha } from "../../utils/format";

export default function AdminPedidos() {
	const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
	const [boxes, setBoxes] = useState<Box[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([
			fetchJson<PedidoAdmin[]>(
				"/api/admin/pedidos",
				"No se pudieron cargar los pedidos",
			),
			fetchJson<Box[]>("/api/boxes", "No se pudieron cargar los boxes"),
		])
			.then(([dataPedidos, dataBoxes]) => {
				setPedidos(dataPedidos.data);
				setBoxes(dataBoxes.data);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <p>Cargando...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div>
			<h1>Pedidos</h1>
			{pedidos.map((pedido) => {
				const box_pedido = boxes.find((box) => box.id === pedido.box_id);

				return (
					<div key={pedido.id}>
						<p>ID: {pedido.id}</p>
						<p>Fecha de entrega: {formatFecha(pedido.fecha_entrega)}</p>
						<p>Estado: {pedido.estado}</p>
						<p>Nombre: {pedido.nombre_cliente}</p>
						<p>Teléfono: {pedido.telefono_cliente}</p>
						<p>Box: {box_pedido?.nombre}</p>
						<p>Total: {formatCOP(pedido.precio_total)}</p>
					</div>
				);
			})}
		</div>
	);
}
