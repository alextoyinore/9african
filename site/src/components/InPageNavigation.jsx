import React, { useEffect, useRef, useState } from 'react'

export let activeTabRef
export let activeTabIndexRef

const InPageNavigation = ({ 
    routes, 
    defaultHidden = [],
    defaultActiveTab = 0,
    children
 }) => {

  let  [ inPageNavIndex, setInPageNavIndex ] = useState(defaultActiveTab)

  activeTabRef = useRef()
  activeTabIndexRef = useRef()


  const changePageState = (button, index) => {
    let { offsetWidth, offsetLeft } = button
    
    activeTabIndexRef.current.style.width = offsetWidth + 'px'
    activeTabIndexRef.current.style.left = offsetLeft + 'px'

    setInPageNavIndex(index)

  }

  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveTab)
  }, [])

  return (
    <>
        <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
            {
                routes.map((route, index) => {
                    return (
                        <button 
                            ref={(index == defaultActiveTab) ? activeTabRef : null}
                            key={index} 
                            className={'p-4 px-5 capitalize ' + (inPageNavIndex == index ? 'text-black ' : 'text-dark-grey ') + (defaultHidden.includes(route) ? 'md:hidden' : '') }
                            onClick={(e) => changePageState(e.target, index)}
                        >
                            {route}
                        </button>
                    )
                })
            }
            <hr ref={activeTabIndexRef} className='absolute bottom-0 duration-300' />
        </div>

        { Array.isArray(children) ? children[inPageNavIndex] : null }
    </>
  )
}

export default InPageNavigation

