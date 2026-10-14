import type { ApiResponse } from "../types";

export async function fetchJson<T>(
	url: string,
	errorMessage: string,
): Promise<ApiResponse<T>> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(errorMessage);
	return (await res.json()) as ApiResponse<T>;
}
