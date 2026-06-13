'use client';

import { useState } from 'react';

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/submit', { method: 'POST', body: formData });
    const data = await res.json();

    if (res.ok) {
      setMessage({ type: 'success', text: data.message });
      e.currentTarget.reset();
    } else {
      setMessage({ type: 'error', text: data.error || 'Terjadi kesalahan' });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">📚 PraktikumSubmit</h1>
        <h2 className="text-xl mb-4">Form Pengumpulan Tugas</h2>

        {message && (
          <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-1">NIM</label>
            <input type="text" name="nim" required className="w-full border rounded px-3 py-2" placeholder="0920240031" />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Nama Lengkap</label>
            <input type="text" name="name" required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Kelas</label>
            <input type="text" name="class" required className="w-full border rounded px-3 py-2" placeholder="IF-7C" />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Mata Kuliah</label>
            <select name="course" required className="w-full border rounded px-3 py-2">
              <option value="">Pilih</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Pemrograman Web">Pemrograman Web</option>
              <option value="Basis Data">Basis Data</option>
              <option value="Jaringan Komputer">Jaringan Komputer</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block font-bold mb-1">File Tugas (PDF/DOCX/ZIP)</label>
            <input type="file" name="task_file" accept=".pdf,.docx,.zip" required className="w-full" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Mengirim...' : '📤 Kumpulkan Tugas'}
          </button>
        </form>

        <hr className="my-6" />
        <p className="text-center">
          <a href="/task-list" className="text-blue-600 hover:underline">📋 Lihat Daftar Tugas</a>
        </p>
      </div>
    </div>
  );
}