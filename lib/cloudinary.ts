export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deletePDF(publicId: string) {
  const timestamp = new Date().getTime();
  const signature = crypto
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest('hex');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/delete_by_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_id: publicId,
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY
      })
    }
  );

  if (!response.ok) throw new Error('Deletion failed');
} 