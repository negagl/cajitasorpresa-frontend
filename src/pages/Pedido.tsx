import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { ApiResponse, Box } from "../types";
import { formatCOP } from "../utils/format";

export default function Pedido() {
	const params = useParams();
	const boxId = params.boxId;

	const [box, setBox] = useState<Box | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch(`/api/boxes/${boxId}`)
			.then((res) => {
				if (!res.ok)
					throw new Error("No se pudo encontrar el box seleccionado");
				return res.json();
			})
			.then((json: ApiResponse<Box>) => setBox(json.data))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [box?.id]);

	if (loading) return <p className="p-4">Cargando...</p>;
	if (error) return <p className="p-4 text-red-600">{error}</p>;
	if (!box) return null;

	return (
		<div className="p-4">
			<Link
				to="/"
				className="block text-center rounded-lg bg-pink-600 px-4 py-2 font-semibold text-white"
			>
				← Volver al catálogo
			</Link>
			<div>
				<h1 className="font-bold">{box.nombre}</h1>
				{box.imagen && <img src={box.imagen} alt={box.nombre} />}
				<p className="whitespace-pre-line">{box.descripcion}</p>
				<p className="font-bold">{formatCOP(box.precio_base)}</p>
			</div>
		</div>
	);
}
