// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    'cloud_name': process.env.CLOUDINARY_NAME,
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET
});
const allowedMimeImage = ['image/gif', 'image/png', 'image/jpeg', 'image/webp'];

const _uploadImage = async (image: Express.Multer.File): Promise<string> => {
    if (!allowedMimeImage.some(type => type === image.mimetype)) {
        throw new Error(`Tipo '${image.mimetype}' não permitido para imagem`);
    }
    return (await cloudinary.uploader.upload(image.path)).url;
};

export const fileUploadService = {
    uploadImage: _uploadImage
};
