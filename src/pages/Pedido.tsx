import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Box, CrearPedidoInput, Extra, ExtraInput } from "../types";
import { formatCOP } from "../utils/format";
import { fetchJson } from "../utils/api";
import ExtraItem from "../components/ExtraItem";

export default function Pedido() {
	const params = useParams();
	const boxId = params.boxId;

	const [box, setBox] = useState<Box | null>(null);
	const [extras, setExtras] = useState<Extra[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState({
		nombre_cliente: "",
		telefono_cliente: "",
		fecha_entrega: "",
		sabor_jugo: "Mora",
		con_azucar: false,
		mensaje_tarjeta: "",
	});
	const [cantidades, setCantidades] = useState<Record<number, number>>({});
	const [enviando, setEnviando] = useState(false);
	const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
	const [pedidoEnviado, setPedidoEnviado] = useState(false);

	useEffect(() => {
		Promise.all([
			fetchJson<Box>(
				`/api/boxes/${boxId}`,
				"No se pudo cargar el box seleccionado",
			),
			fetchJson<Extra[]>("/api/extras", "No se pudieron cargar los extras"),
		])
			.then(([boxJson, extrasJson]) => {
				setBox(boxJson.data);
				setExtras(extrasJson.data);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [boxId]);

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) {
		const { name, value, type } = e.target;
		setForm((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	}

	function cambiarCantidad(id: number, delta: number) {
		setCantidades((prev) => ({
			...prev,
			[id]: Math.max(0, (prev[id] ?? 0) + delta),
		}));
	}

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();

		// crear el body del post
		const fechaISO = new Date(form.fecha_entrega).toISOString();
		const extrasSeleccionados: ExtraInput[] = extras
			.filter((extra) => (cantidades[extra.id] ?? 0) > 0)
			.map((extra) => ({
				extra_id: extra.id,
				cantidad: cantidades[extra.id],
			}));
		const body: CrearPedidoInput = {
			...form,
			fecha_entrega: fechaISO,
			box_id: Number(boxId),
			extras: extrasSeleccionados,
			personalizacion: [],
		};

		setEnviando(true);
		setErrorEnvio(null);

		try {
			const res = await fetch("/api/pedidos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error("No se pudo enviar el pedido");
			setPedidoEnviado(true);
		} catch (err) {
			setErrorEnvio(err instanceof Error ? err.message : "Error inesperado");
		} finally {
			setEnviando(false);
		}
	}

	if (pedidoEnviado) {
		return (
			<div className="p-4 space-y-4">
				<h1 className="text-xl font-bold">¡Recibimos tu pedido!</h1>
				<p>Pronto nos pondremos en contacto contigo para confirmarlo.</p>
				<Link to="/" className="text-pink-600 underline">
					Volver al catálogo
				</Link>
			</div>
		);
	}
	if (loading) return <p className="p-4">Cargando...</p>;
	if (error) return <p className="p-4 text-red-600">{error}</p>;
	if (!box) return null;

	const adicionales = extras.filter((item) => item.tipo === "adicional");
	const complementos = extras.filter((item) => item.tipo === "complemento");
	let total = box.precio_base;
	for (const extra of extras) {
		total += extra.precio_base * (cantidades[extra.id] ?? 0);
	}

	return (
		<div className="p-4 pb-24">
			<Link to="/" className="text-pink-600 underline">
				← Volver al catálogo
			</Link>

			{/* Box Info */}
			<div>
				<h1 className="font-bold">{box.nombre}</h1>
				{box.imagen && <img src={box.imagen} alt={box.nombre} />}
				<p className="whitespace-pre-line">{box.descripcion}</p>
				<p className="font-bold">{formatCOP(box.precio_base)}</p>
			</div>

			{/* Extras */}
			<div className="grid grid-cols-1 sm:grid-cols-2 mt-6">
				<div>
					<p className="font-bold">Adicionales:</p>
					<ul className="list-none">
						{adicionales.map((item) => (
							<ExtraItem
								key={item.id}
								extra={item}
								cantidad={cantidades[item.id] ?? 0}
								onCambiarCantidad={(delta) => cambiarCantidad(item.id, delta)}
							/>
						))}
					</ul>
				</div>
				<div>
					<p className="font-bold">Complementos:</p>
					<ul className="list-none">
						{complementos.map((item) => (
							<ExtraItem
								key={item.id}
								extra={item}
								cantidad={cantidades[item.id] ?? 0}
								onCambiarCantidad={(delta) => cambiarCantidad(item.id, delta)}
							/>
						))}
					</ul>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-4 mt-6">
				{/* Nombre */}
				<label className="block">
					<span className="font-semibold">Nombre</span>
					<input
						type="text"
						name="nombre_cliente"
						value={form.nombre_cliente}
						onChange={handleChange}
						required
						className="mt-1 w-full rounded-lg border p-2"
					/>
				</label>

				{/* Telefono */}
				<label className="block">
					<span className="font-semibold">Teléfono</span>
					<input
						type="tel"
						name="telefono_cliente"
						value={form.telefono_cliente}
						onChange={handleChange}
						required
						className="mt-1 w-full rounded-lg border p-2"
					/>
				</label>

				{/* Fecha de entrega */}
				<label className="block">
					<span className="font-semibold">Fecha de entrega</span>
					<input
						type="datetime-local"
						name="fecha_entrega"
						value={form.fecha_entrega}
						onChange={handleChange}
						required
						className="mt-1 w-full rounded-lg border p-2"
					/>
				</label>

				{/* Sabor del jugo */}
				<label>
					<span>Sabor del jugo:</span>
					<select
						name="sabor_jugo"
						value={form.sabor_jugo}
						onChange={handleChange}
						className="mt-1 w-full rounded-lg border p-2"
					>
						<option value={"Mora"}>Mora</option>
						<option value={"Maracuyá"}>Maracuyá</option>
						<option value={"Naranja"}>Naranja</option>
					</select>
				</label>

				{/* Con Azucar */}
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						name="con_azucar"
						checked={form.con_azucar}
						onChange={handleChange}
					/>
					<span className="">Con azucar</span>
				</label>

				{/* Mensaje de la tarjeta */}
				<label>
					<span>Mensaje personalizado</span>
					<textarea
						name="mensaje_tarjeta"
						value={form.mensaje_tarjeta}
						onChange={handleChange}
						className="mt-1 w-full rounded-lg border p-2"
					/>
				</label>

				{/* Submit */}
				{errorEnvio && <p className="text-red-600">{errorEnvio}</p>}
				<button
					type="submit"
					className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white"
					disabled={enviando}
				>
					{enviando ? "Enviando pedido..." : "Enviar pedido"}
				</button>
			</form>

			{/* Total */}
			<div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
				<p className="font-bold">Total: {formatCOP(total)}</p>
			</div>
		</div>
	);
}
