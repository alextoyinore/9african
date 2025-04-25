import axios from "axios"
import toast from "react-hot-toast"

export const cloudinaryImageUpload = async (image) => {
    let imageURL = null

    const data = new FormData();
    data.append("file", image);

    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-image-url', data)
    .then((url) => {
        imageURL = url.data.url
    })
    .catch(error => {
        toast.error(error.message)
    })

    return imageURL
}

