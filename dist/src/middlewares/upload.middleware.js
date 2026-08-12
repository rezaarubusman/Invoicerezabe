import { ApiError } from "../utils/api-error.js";
import multer from "multer";
export class UploadMiddleware {
    storage = multer.memoryStorage();
    getFileFilter(type) {
        return (_req, file, cb) => {
            if (type === "image") {
                const allowed = ["image/jpeg", "image/png"];
                if (!allowed.includes(file.mimetype)) {
                    return cb(new ApiError("Only JPG/PNG files are allowed", 400));
                }
            }
            if (type === "pdf") {
                if (file.mimetype !== "application/pdf") {
                    return cb(new ApiError("Only PDF files are allowed", 400));
                }
            }
            cb(null, true);
        };
    }
    upload(type, maxSize = 2) {
        return multer({
            storage: this.storage,
            limits: {
                fileSize: maxSize * 1024 * 1024,
            },
            fileFilter: this.getFileFilter(type),
        });
    }
    /**
     * Shortcut: upload image (profile photo, banner)
     */
    uploadImage(maxSize = 2) {
        return this.upload("image", maxSize);
    }
    /**
     * Shortcut: upload PDF (CV)
     */
    uploadPDF(maxSize = 2) {
        return this.upload("pdf", maxSize);
    }
}
