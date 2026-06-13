import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, SASProtocol } from '@azure/storage-blob';

const accountName = 'storpraktikum0920240031';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = 'tugas-praktikum';

const credential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function getValidBlobName(fileUrl: string): Promise<string | null> {
    try {
        // Ambil nama blob dari URL
        let blobName = fileUrl.split('/').pop() || '';
        blobName = decodeURIComponent(blobName);
        
        // Cek apakah blob benar-benar ada di container
        const blobClient = containerClient.getBlockBlobClient(blobName);
        const exists = await blobClient.exists();
        
        if (exists) {
            return blobName;
        }
        
        // Kalau ga ada, coba list semua blob dan cari yang mirip
        console.log(`Blob ${blobName} not found, searching...`);
        
        const prefix = blobName.split('_')[0] + '_'; // cari berdasarkan NIM
        const blobs = containerClient.listBlobsFlat({ prefix });
        
        for await (const blob of blobs) {
            if (blob.name.includes(blobName.split('_')[1] || '')) {
                console.log(`Found matching blob: ${blob.name}`);
                return blob.name;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error checking blob:', error);
        return null;
    }
}

function generateSasUrl(blobName: string): string {
    const sasOptions = {
        containerName,
        blobName,
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
        permissions: 'r',
        protocol: SASProtocol.Https
    };
    
    const sasToken = generateBlobSASQueryParameters(sasOptions, credential).toString();
    return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT * FROM submissions ORDER BY submitted_at DESC');
        
        // Generate SAS URL untuk setiap file yang VALID
        const submissionsWithSas = [];
        
        for (const row of rows) {
            const validBlobName = await getValidBlobName(row.file_url);
            
            if (validBlobName) {
                submissionsWithSas.push({
                    ...row,
                    file_url: generateSasUrl(validBlobName)
                });
            } else {
                // Kalau blob ga ditemukan, tetap tampilkan tapi tanpa link download
                submissionsWithSas.push({
                    ...row,
                    file_url: null,
                    file_error: 'File not found in storage'
                });
            }
        }
        
        return NextResponse.json(submissionsWithSas);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
