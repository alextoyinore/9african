import React from 'react'

const LoadMore = ({ state, fetchDataFunc }) => {

    if(state != null && state.totalDocs > state.results.length) {
        return (
            <button
                className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-full flex items-center gap-2'
                onClick={() => fetchDataFunc(state.page + 1)}
            >Load More</button>
        )
    }
}

export default LoadMore

