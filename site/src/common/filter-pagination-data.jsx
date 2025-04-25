import toast from "react-hot-toast"
import axios from "axios"

export const filterPaginationData = async (
    { 
        createNewArray = false, 
        state, 
        data, 
        page, 
        countRoute, 
        dataToSend }) => {
    let obj

    if(state != null && !createNewArray) {
        obj = { ...state, results: [ ...state.results, ...data], page: page }
    } else {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, dataToSend)
        .then(({data: { totalDocs }}) => {
            obj = { results: data, page: 1, totalDocs }
        })
        .catch(err => {
            toast.error(err.message)
        })
    }

    return obj
}

