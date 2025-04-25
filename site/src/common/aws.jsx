import axios from "axios"
import toast from "react-hot-toast"

export const uploadImage = async (image) => {
    let imageURL = null

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/get-upload-url')
    .then( async ({ data: { uploadURL }}) => {
      await axios({
        method: 'PUT',
        url: uploadURL,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: image
      })
      .then(() => {
        imageURL = uploadURL.split('?')[0]
      })
      .catch(err => {
        toast.error(err.message)
      })
    })
    .catch(err => {
      toast.error(err.message)
    })
    return imageURL
}

