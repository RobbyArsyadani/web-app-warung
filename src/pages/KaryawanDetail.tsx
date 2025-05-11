import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Transaksi {
  tanggal: Date;
  tipe: "hutang" | "pembayaran";
  nominal: number;
  barang?: string;
  keterangan?: string;
}

const KaryawanDetail = () => {
  const navigate = useNavigate();
  const { nama: id } = useParams(); // id dokumen
  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "Hutang", id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNamaKaryawan(data.nama || "(Tanpa Nama)");

        const detailList = data.detail_hutang || [];
        const pembayaranList = data.pembayaran || [];

        const mergedList: Transaksi[] = [];

        detailList.forEach((item: any) => {
          mergedList.push({
            tipe: "hutang",
            tanggal: item.tanggal?.toDate(),
            nominal: item.harga || 0,
            barang: item.barang || "-",
            keterangan: item.keterangan || "-",
          });
        });

        pembayaranList.forEach((item: any) => {
          mergedList.push({
            tipe: "pembayaran",
            tanggal: item.tanggal?.toDate(),
            nominal: item.jumlah || 0,
            keterangan: item.keterangan || "-",
          });
        });

        mergedList.sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());

        const totalHutang = mergedList.reduce((acc, curr) => {
          return acc + (curr.tipe === "hutang" ? curr.nominal : -curr.nominal);
        }, 0);

        setTransaksiList(mergedList);
        setTotal(totalHutang);
      } else {
        setNamaKaryawan("(Data tidak ditemukan)");
      }
    });

    return () => unsubscribe(); // membersihkan listener saat komponen unmount
  }, [id]);

  const handleLunas = async () => {
    const konfirmasi = window.confirm(
      "Apakah kamu yakin ingin menghapus semua data hutang dan pembayaran? Data ini akan direset dan tidak bisa dikembalikan."
    );
    if (!konfirmasi || !id) return;

    try {
      const docRef = doc(db, "Hutang", id);
      await updateDoc(docRef, {
        detail_hutang: [],
        pembayaran: [],
        total_hutang: 0,
      });
      alert("Data hutang berhasil direset.");
    } catch (error) {
      console.error("Gagal mereset data hutang:", error);
      alert("Terjadi kesalahan saat mereset hutang.");
    }
  };
  const handleEdit = (tipe: string, index: number) => {
    if (tipe === "hutang") {
      navigate(`/edit-hutang/${id}/${index}`);
    } else {
      navigate(`/edit-pembayaran/${id}/${index}`);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Riwayat Transaksi - {namaKaryawan}
      </h1>
      <table className="w-full border text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tanggal</th>
            <th className="p-2 border">Tipe</th>
            <th className="p-2 border">Barang</th>
            <th className="p-2 border">Nominal</th>
            <th className="p-2 border">Keterangan</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transaksiList.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">
                {item.tanggal.toLocaleDateString()}
              </td>
              <td
                className={`p-2 border font-semibold ${
                  item.tipe === "pembayaran"
                    ? "text-green-600 border-green-600"
                    : "text-red-600 border-red-600"
                }`}
              >
                {item.tipe === "hutang" ? "Hutang" : "Pembayaran"}
              </td>
              <td className="p-2 border">{item.barang || "-"}</td>
              <td className="p-2 border">
                {(item.tipe === "pembayaran" ? "-" : "") +
                  item.nominal.toLocaleString()}
              </td>
              <td className="p-2 border">{item.keterangan}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(item.tipe, index)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 font-bold text-right">
        Total Hutang Saat Ini: {total.toLocaleString()}
      </div>

      <button
        onClick={handleLunas}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 float-right"
      >
        Tandai Lunas
      </button>
    </div>
  );
};

export default KaryawanDetail;

