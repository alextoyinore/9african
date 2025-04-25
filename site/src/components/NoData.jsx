import React from 'react'

const NoData = ({message}) => {

    const refreshPage = () => {
        
    }

  return (
    <div className='text-center w-full flex justify-center gap-2 p-4 rounded-full bg-grey/50 mt-4'>
        <p className='text-dark-grey'>{message} </p>
        <span 
            className='text-black underline'
            onClick={refreshPage}
        >Refresh</span>
    </div>
  )
}

export default NoData
