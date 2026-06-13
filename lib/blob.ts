import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

export const containerClient = BlobServiceClient
  .fromConnectionString(connectionString)
  .getContainerClient(containerName);