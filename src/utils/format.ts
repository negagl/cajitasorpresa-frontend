export function formatCOP(precio: number) {
	return Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(precio);
}
