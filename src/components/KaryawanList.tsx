import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router";
import { db } from "../firebase";

interface DetailHutang {
  barang: string;
  harga: number;
  keterangan?: string;
  tanggal?: string;
}

interface Pembayaran {
  jumlah: number;
  tanggal?: string;
}

interface Hutang {
  id: string;
  nama: string;
  totalHutang: number;
}

const KaryawanList = () => {
  const [data, setData] = useState<Hutang[]>([]);
  const navigate = useNavigate();

  // const fetchData = async () => {
  //   const snapshot = await getDocs(collection(db, "Hutang"));
  //   const result: Hutang[] = [];

  //   snapshot.forEach((docu) => {
  //     const d = docu.data();
  //     const detail: DetailHutang[] = d.detail_hutang || [];
  //     const pembayaran: Pembayaran[] = d.pembayaran || [];

  //     const totalDetail = detail.reduce(
  //       (sum, item) => sum + Number(item.harga || 0),
  //       0
  //     );
  //     const totalBayar = pembayaran.reduce(
  //       (sum, item) => sum + Number(item.jumlah || 0),
  //       0
  //     );
  //     const totalHutang = totalDetail - totalBayar;

  //     result.push({
  //       id: docu.id,
  //       nama: d.nama || "Tanpa Nama",
  //       totalHutang,
  //     });
  //   });

  //   setData(result);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Hutang"), (snapshot) => {
      const result: Hutang[] = [];

      snapshot.forEach((docu) => {
        const d = docu.data();
        const detail: DetailHutang[] = d.detail_hutang || [];
        const pembayaran: Pembayaran[] = d.pembayaran || [];

        const totalDetail = detail.reduce(
          (sum, item) => sum + Number(item.harga || 0),
          0
        );
        const totalBayar = pembayaran.reduce(
          (sum, item) => sum + Number(item.jumlah || 0),
          0
        );
        const totalHutang = totalDetail - totalBayar;

        result.push({
          id: docu.id,
          nama: d.nama || "Tanpa Nama",
          totalHutang,
        });
      });

      setData(result);
    });

    return () => unsubscribe(); // membersihkan listener saat komponen unmount
  }, []);
  const handleTambahUtang = (id: string) => {
    navigate(`/tambahDetailHutang/${id}`);
  };
  const handleTambahPembayaran = (id: string) => {
    navigate(`/tambahPembayaran/${id}`);
  };

  const handleDelete = async (id: string) => {
    const konfirmasi = confirm("Yakin ingin menghapus data ini?");
    if (konfirmasi) {
      await deleteDoc(doc(db, "Hutang", id));
      setData((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daftar Hutang Karyawan</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Total Hutang</th>
            <th className="p-2 border">Aksi</th>
            <th className="p-2 border">Detail</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 border">{d.nama}</td>
              <td className="p-2 border">
                Rp {d.totalHutang.toLocaleString()}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                >
                  Hapus
                </button>
                <button
                  onClick={() => handleTambahUtang(d.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                >
                  Tambah hutang
                </button>
                <button
                  onClick={() => handleTambahPembayaran(d.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Tambah pembayaran
                </button>
              </td>
              <td className="p-2 border">
                <Link
                  to={`/karyawan/${d.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Lihat Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KaryawanList;

