export function formatCOP(precio: number) {
	return Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(precio);
}
export function formatFecha(iso: string) {
	return new Date(iso).toLocaleString("es-CO", {
		dateStyle: "full",
		timeStyle: "short",
	});
}