import { BrowserRouter, Routes, Route } from "react-router";
import FormTambahHutang from "./components/FormTambahHutang";
import KaryawanList from "./components/KaryawanList";
import KaryawanDetail from "./pages/KaryawanDetail";
import EditDetailHutang from "./pages/EditDetailHutang";
import FormTambahDetailHutang from "./pages/FormTambahDetailHutang";
import FormTambahPembayaran from "./pages/FormTambahPembayaran";
import EditDetailPembayaran from "./pages/EditDetailPembayaran";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-6 space-y-6">
              <FormTambahHutang />
              <KaryawanList />
            </div>
          }
        />
        <Route path="/karyawan/:nama" element={<KaryawanDetail />} />
        <Route path="/edit-hutang/:id/:index" element={<EditDetailHutang />} />
        <Route
          path="/edit-pembayaran/:id/:index"
          element={<EditDetailPembayaran />}
        />
        <Route
          path="/tambahDetailHutang/:id"
          element={<FormTambahDetailHutang />}
        />
        <Route
          path="/tambahPembayaran/:id"
          element={<FormTambahPembayaran />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

