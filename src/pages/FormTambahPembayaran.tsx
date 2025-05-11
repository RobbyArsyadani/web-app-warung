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

const FormTambahPembayaran = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumlah) return alert("Jumlah pembayaran wajib diisi");
    if (!id) return alert("ID dokumen tidak ditemukan");

    const newPayment = {
      jumlah: parseInt(jumlah),
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
      const currentPayments = data?.pembayaran || [];

      await updateDoc(docRef, {
        pembayaran: [...currentPayments, newPayment],
        total_hutang: increment(-newPayment.jumlah), // dikurangi
      });

      setJumlah("");
      setKeterangan("");
      alert("Pembayaran berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan pembayaran:", error);
      alert("Terjadi kesalahan saat menambahkan pembayaran");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow-md mt-6"
      >
        <h2 className="text-lg font-bold">Tambah Pembayaran</h2>
        <input
          type="number"
          placeholder="Jumlah Pembayaran"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Bayar
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

export default FormTambahPembayaran;

