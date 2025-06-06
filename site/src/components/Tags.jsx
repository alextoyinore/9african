import React, { useContext } from 'react'
import { EditorContext } from '../pages/Editor'

const Tags = ({ tag, tagIndex }) => {

    let { blog: { tags }, setBlog, blog } = useContext(EditorContext)

    const handleDeleteTag = () => {
        tags = tags.filter(t => t != tag)
        setBlog({ ...blog, tags })
    }

    const handleTagEdit = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault()

            const currentTag = e.target.innerText

            tags[tagIndex] = currentTag

            setBlog({...blog, tags})

            e.target.removeAttribute('contentEditable', false)
        }
    }

    const makeEditable = (e) => {
        e.target.setAttribute('contentEditable', true)
        e.target.focus()
    }

  return (
    <div
        className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'
    >
        <p className='outline-none' onKeyDown={handleTagEdit} onClick={makeEditable}>{ tag }</p>
        <button
            onClick={handleDeleteTag}
            className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2'>
            <i className='fi fi-br-cross text-sm pointer-events-none'></i>
        </button>
    </div>
  )
}

export default Tags
