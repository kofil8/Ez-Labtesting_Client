/**
 * Azure Blob Storage Upload Utility
 * 
 * TODO: Configure Azure Blob Storage credentials
 * 
 * Required environment variables:
 * - AZURE_STORAGE_ACCOUNT_NAME
 * - AZURE_STORAGE_ACCOUNT_KEY (or use Azure AD authentication)
 * - AZURE_STORAGE_CONTAINER_NAME
 * 
 * Example usage:
 * ```typescript
 * const imageUrl = await uploadImageToAzureBlob(file)
 * ```
 */

export interface AzureBlobConfig {
  accountName: string
  accountKey?: string
  containerName: string
  // Optional: Use Azure AD authentication instead of account key
  useAzureAD?: boolean
}

/**
 * Uploads an image file to Azure Blob Storage
 * @param file - The image file to upload
 * @param folder - Optional folder path within the container (e.g., 'tests/')
 * @returns Promise<string> - The URL of the uploaded image
 */
export async function uploadImageToAzureBlob(
  file: File,
  folder: string = 'tests/'
): Promise<string> {
  // TODO: Implement Azure Blob Storage upload
  // 
  // Example implementation structure:
  // 1. Generate unique filename (e.g., using UUID or timestamp)
  // 2. Create blob client using @azure/storage-blob
  // 3. Upload file to blob storage
  // 4. Return the public URL of the uploaded blob
  //
  // Example code structure:
  // const { BlobServiceClient } = require('@azure/storage-blob')
  // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  // const containerClient = blobServiceClient.getContainerClient(containerName)
  // const blobClient = containerClient.getBlockBlobClient(blobName)
  // await blobClient.uploadData(fileBuffer)
  // return blobClient.url

  throw new Error('Azure Blob Storage upload not yet configured. Please provide credentials.')
}

/**
 * Deletes an image from Azure Blob Storage
 * @param imageUrl - The URL of the image to delete
 */
export async function deleteImageFromAzureBlob(imageUrl: string): Promise<void> {
  // TODO: Implement Azure Blob Storage deletion
  throw new Error('Azure Blob Storage deletion not yet configured.')
}

/**
 * Validates if a file is a valid image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  return { valid: true }
}

