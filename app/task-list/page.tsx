'use client';

import { useEffect, useState } from 'react';

type Submission = {
  id: number;
  nim: string;
  name: string;
  class: string;
  course: string;
  file_url: string;
  status: string;
  submitted_at: string;
};

export default function TaskListPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">📋 Daftar Pengumpulan Tugas</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">ID</th>
                <th className="border p-2">NIM</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Kelas</th>
                <th className="border p-2">Mata Kuliah</th>
                <th className="border p-2">File</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">{sub.id}</td>
                  <td className="border p-2">{sub.nim}</td>
                  <td className="border p-2">{sub.name}</td>
                  <td className="border p-2">{sub.class}</td>
                  <td className="border p-2">{sub.course}</td>
                  <td className="border p-2 text-center">
                    <a href={sub.file_url} target="_blank" className="text-blue-600 underline">Download</a>
                  </td>
                  <td className="border p-2 text-center">{sub.status}</td>
                  <td className="border p-2 text-center">{new Date(sub.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <a href="/submit" className="text-blue-600 hover:underline">⬅️ Kembali ke Form</a>
        </div>
      </div>
    </div>
  );
}