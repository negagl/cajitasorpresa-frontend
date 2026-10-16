import { Route, Routes } from "react-router";
import Catalogo from "./pages/Catalogo";
import Pedido from "./pages/Pedido";
import AdminPedidos from "./pages/admin/AdminPedidos";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Catalogo />} />
			<Route path="/pedido/:boxId" element={<Pedido />} />
			<Route path="/admin" element={<AdminPedidos />} />
		</Routes>
	);
}

export default App;
