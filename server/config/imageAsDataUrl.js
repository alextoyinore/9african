/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict'


const imageAsDataURL = (imageBlob) => {
    const filelReader = new FileReader();

    filelReader.readAsDataURL(imageBlob);

    return new Promise((resolve, reject) => {
        filelReader.addEventListener('load', () => {
            resolve(filelReader.result);
        });

        filelReader.addEventListener('error', () => {
            reject(filelReader.error);
        });
    });
}

export default imageAsDataURL
