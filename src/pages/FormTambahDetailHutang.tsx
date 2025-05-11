import { useState } from "react";
import {
  doc,
  updateDoc,
  increment,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router";

const FormTambahDetailHutang = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [barang, setBarang] = useState("");
  const [harga, setHarga] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barang || !harga) return alert("Barang dan harga wajib diisi");
    if (!id) return alert("ID dokumen tidak ditemukan");

    const newDetail = {
      barang,
      harga: parseInt(harga),
      keterangan,
      tanggal: Timestamp.now(),
    };

    try {
      const docRef = doc(db, "Hutang", id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        alert("Data hutang tidak ditemukan");
        return;
      }

      const data = snapshot.data();
      const currentDetails = data?.detail_hutang || [];

      await updateDoc(docRef, {
        detail_hutang: [...currentDetails, newDetail],
        total_hutang: increment(newDetail.harga),
      });

      setBarang("");
      setHarga("");
      setKeterangan("");
      alert("Detail hutang berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan detail hutang:", error);
      alert("Terjadi kesalahan saat menambahkan detail hutang");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow-md mt-6"
      >
        <h2 className="text-lg font-bold">Tambah Detail Hutang</h2>
        <input
          type="text"
          placeholder="Nama Barang"
          value={barang}
          onChange={(e) => setBarang(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Keterangan (opsional)"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tambah
        </button>
      </form>
      <div className="flex justify-end">
        <button
          className="bg-gray-500 text-black px-4 py-2 rounded mt-2 mr-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default FormTambahDetailHutang;

