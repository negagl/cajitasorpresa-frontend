import { Route, Routes } from "react-router";
import Catalogo from "./pages/Catalogo";
import Pedido from "./pages/Pedido";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Catalogo />} />
			<Route path="/pedido/:boxId" element={<Pedido />} />
		</Routes>
	);
}

export default App;
