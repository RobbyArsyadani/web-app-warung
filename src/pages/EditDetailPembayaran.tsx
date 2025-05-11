import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const EditDetailPembayaran = () => {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [oldJumlah, setOldJumlah] = useState(0);

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
      const list = data.pembayaran || [];
      const pembayaran = list[parseInt(index)];

      if (!pembayaran) {
        alert("Pembayaran tidak ditemukan");
        return;
      }

      setJumlah(pembayaran.jumlah?.toString() || "");
      setOldJumlah(pembayaran.jumlah || 0);
      setKeterangan(pembayaran.keterangan || "");
      setTanggal(
        pembayaran.tanggal?.toDate().toISOString().split("T")[0] || ""
      );
    };

    fetchData();
  }, [id, index]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || index === undefined) return;

    const docRef = doc(db, "Hutang", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const list = data.pembayaran || [];

    const newJumlah = parseInt(jumlah);
    const selisih = oldJumlah - newJumlah; // karena hutang dikurangi saat bayar

    list[parseInt(index)] = {
      jumlah: newJumlah,
      keterangan,
      tanggal: Timestamp.fromDate(new Date(tanggal)),
    };

    try {
      await updateDoc(docRef, {
        pembayaran: list,
        total_hutang: data.total_hutang + selisih, // sesuaikan total_hutang
      });
      alert("Pembayaran berhasil diperbarui");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui pembayaran");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Pembayaran</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Jumlah Pembayaran"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

export default EditDetailPembayaran;

