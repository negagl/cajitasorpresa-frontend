import { useEffect, useState } from "react";
import type { Box, ApiResponse } from "../types";
import { formatCOP } from "../utils/format";
import { Link } from "react-router";

export default function Catalogo() {
	const [boxes, setBoxes] = useState<Box[]>([]);
	const [loading, setLoading] = useState<Boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/boxes")
			.then((res) => {
				if (!res.ok) throw new Error("No se pudo cargar el catalogo");
				return res.json();
			})
			.then((json: ApiResponse<Box[]>) => setBoxes(json.data))
			.catch((error) => setError(error.message))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <p className="p-4">Cargando...</p>;
	if (error) return <p className="p-4 text-red-600">{error}</p>;

	return (
		<div className="grid gap-4 sm:grid-cols-2 p-4">
			{boxes.map((box) => (
				<div key={box.id} className="rounded-xl shadow p-4 space-y-2">
					<h2 className="font-bold">{box.nombre}</h2>
					{box.imagen && (
						<img
							src={box.imagen}
							alt={box.nombre}
							className="aspect-square object-cover w-full rounded-lg"
						/>
					)}
					<p className="whitespace-pre-line">{box.descripcion}</p>
					<p className="font-bold">{formatCOP(box.precio_base)}</p>
					<Link
						to={`/pedido/${box.id}`}
						className="block text-center rounded-lg bg-pink-600 px-4 py-2 font-semibold text-white"
					>
						Quiero este box!
					</Link>
				</div>
			))}
		</div>
	);
}
