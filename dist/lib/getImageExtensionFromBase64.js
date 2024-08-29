"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageMimeTypeFromBase64 = getImageMimeTypeFromBase64;
function getImageMimeTypeFromBase64(base64String) {
    const cleanedBase64 = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanedBase64, 'base64');
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return 'image/jpeg';
    }
    else if (buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47) {
        return 'image/png';
    }
    else if (buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46) {
        return 'image/webp';
    }
    else if (buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x18 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x68 &&
        buffer[9] === 0x65 &&
        buffer[10] === 0x69 &&
        buffer[11] === 0x63) {
        return 'image/heic';
    }
    else if (buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x18 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x6d &&
        buffer[9] === 0x69 &&
        buffer[10] === 0x66 &&
        buffer[11] === 0x31) {
        return 'image/heif';
    }
    else {
        return null;
    }
}
