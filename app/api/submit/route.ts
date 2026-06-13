import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { containerClient } from '@/lib/blob';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nim = formData.get('nim') as string;
    const name = formData.get('name') as string;
    const kelas = formData.get('class') as string;
    const course = formData.get('course') as string;
    const file = formData.get('task_file') as File;

    if (!nim || !name || !kelas || !course || !file) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Simpan ke temporary file
    const tempDir = '/tmp';
    const tempFilePath = join(tempDir, `${randomUUID()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    // Upload ke Azure Blob Storage
    const blobName = `${nim}_${name.replace(/\s/g, '_')}_${Date.now()}_${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(tempFilePath);
    const fileUrl = blockBlobClient.url;

    // Hapus file temporary
    await unlink(tempFilePath);

    // Simpan ke database
    const sql = `INSERT INTO submissions (nim, name, class, course, file_url, status) 
                 VALUES (?, ?, ?, ?, ?, 'Submitted')`;
    await pool.execute(sql, [nim, name, kelas, course, fileUrl]);

    return NextResponse.json({ success: true, message: 'Tugas berhasil dikumpulkan!' });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}