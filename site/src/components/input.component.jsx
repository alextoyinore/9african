import React, { useState } from 'react'

const InputBox = ({name, id, placeholder, type, value, icon}) => {

    const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className='relative w-[100%] mb-4'>
        <input
            name={name}
            id={id}
            placeholder={placeholder}
            type={type == 'password' ? passwordVisible ? 'text' : 'password' : type }
            defaultValue={value}
            className='input-box'
        />

        <i className={'fi fi-rr-' + icon + ' input-icon'}></i>

        {
            type == 'password' ?
            <i 
                onClick={() => setPasswordVisible(currentValue => !currentValue)}
                className={'fi fi-rr-eye' + (passwordVisible ? '-crossed' : '') + ' input-icon left-auto right-4 cursor-pointer'}></i> : null
        }
    </div>
  )
}

export default InputBox
