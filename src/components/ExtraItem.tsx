import type { Extra } from "../types";
import { formatCOP } from "../utils/format";

interface ExtraItemProps {
	extra: Extra;
	cantidad: number;
	onCambiarCantidad: (delta: number) => void;
}

export default function ExtraItem({
	extra,
	cantidad,
	onCambiarCantidad,
}: ExtraItemProps) {
	return (
		<li className="flex items-center justify-between py-1">
			<span>
				{extra.nombre} | {formatCOP(extra.precio_base)}
			</span>
			<span className="flex items-center gap-2">
				<button type="button" onClick={() => onCambiarCantidad(-1)}>
					-
				</button>
				<span>{cantidad}</span>
				<button type="button" onClick={() => onCambiarCantidad(+1)}>
					+
				</button>
			</span>
		</li>
	);
}
