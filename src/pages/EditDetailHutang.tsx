import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const EditDetailHutang = () => {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const [tanggal, setTanggal] = useState("");
  const [barang, setBarang] = useState("");
  const [harga, setHarga] = useState("");
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id || index === undefined) return;

      const docRef = doc(db, "Hutang", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Data tidak ditemukan");
        return;
      }

      const data = docSnap.data();
      const detailList = data.detail_hutang || [];

      const hutang = detailList[parseInt(index)];
      if (!hutang) {
        alert("Detail hutang tidak ditemukan");
        return;
      }

      setTanggal(hutang.tanggal?.toDate().toISOString().split("T")[0]);
      setBarang(hutang.barang || "");
      setHarga(hutang.harga?.toString() || "");
      setKeterangan(hutang.keterangan || "");
    };

    fetchData();
  }, [id, index]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || index === undefined) return;

    const docRef = doc(db, "Hutang", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return alert("Dokumen tidak ditemukan");

    const data = docSnap.data();
    const detailList = data.detail_hutang || [];

    detailList[parseInt(index)] = {
      tanggal: Timestamp.fromDate(new Date(tanggal)),
      barang,
      harga: parseInt(harga),
      keterangan,
    };

    try {
      await updateDoc(docRef, {
        detail_hutang: detailList,
      });
      alert("Data berhasil diperbarui!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Detail Hutang</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Nama Barang"
          value={barang}
          onChange={(e) => setBarang(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Keterangan (opsional)"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-400 text-black px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDetailHutang;

