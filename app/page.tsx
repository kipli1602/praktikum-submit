import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">PraktikumSubmit</h1>
        <p className="text-gray-600 mb-6">Sistem Pengumpulan Tugas Praktikum Berbasis Cloud</p>
        <div className="space-x-4">
          <Link href="/submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            📤 Kumpulkan Tugas
          </Link>
          <Link href="/task-list" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
            📋 Lihat Tugas
          </Link>
        </div>
      </div>
    </div>
  );
}