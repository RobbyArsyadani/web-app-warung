import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const FormTambahHutang = () => {
  const [nama, setNama] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) return alert("Nama harus diisi");

    try {
      await addDoc(collection(db, "Hutang"), {
        nama,
        total_hutang: 0,
        detail_hutang: [],
        pembayaran: [],
        lunas: false,
      });
      setNama("");
      alert("Hutang berhasil ditambahkan!");
    } catch (error) {
      alert("Gagal menambahkan hutang");
      console.error(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow-md"
      >
        <h2 className="text-lg font-bold">Tambah Hutang</h2>
        <input
          type="text"
          placeholder="Nama Karyawan"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default FormTambahHutang;

