import { v2 as cloudinary } from "cloudinary";

export default async function (file, folder, height, width, quality) {
    const options = { folder };
    if (height) {
        options.height = height;
    }
    if(width) {
        options.width = width;
    }

    if (quality) {
        options.quality = quality;
    }
    else{
        options.quality = "auto";
    }

    options.fetch_format = "auto";

    // Automatically handle type -> images or videos
    options.resource_type = "auto";

   return await cloudinary.uploader.upload(file.tempFilePath, options);

}