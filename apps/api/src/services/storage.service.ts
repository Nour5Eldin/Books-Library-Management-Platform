import { supabase } from '../config/supabase';

const BUCKET_NAME = 'book-covers';

export const uploadBookCover = async (
    file: Express.Multer.File,
    filePath: string,
) => {
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) {
        throw new Error(`Failed to upload book cover: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return {
        url: publicUrlData.publicUrl,
        path: data.path,
    };
};

export const deleteBookCover = async (filePath: string): Promise<void> => {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

    if (error) {
        throw new Error(`Failed to delete book cover: ${error.message}`);
    }
};