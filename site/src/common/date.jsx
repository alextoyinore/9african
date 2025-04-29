let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const getDay = (timestamp) => {
    let date = new Date(timestamp)

    return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay = (timestamp) => {
    let date = new Date(timestamp)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}