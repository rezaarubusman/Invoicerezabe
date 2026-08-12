import { ApiError } from "./api-error.js";
export function getParamId(id) {
    if (!id || Array.isArray(id)) {
        throw new ApiError("Invalid ID parameter", 400);
    }
    return id;
}
