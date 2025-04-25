import React, { useContext, useState, createContext } from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import BlogEditor from '../components/BlogEditor'
import PublishForm from '../components/PublishForm'

const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: { personal_info: {  } }
}

export const EditorContext = createContext({})

const Editor = () => {

    const [blog, setBlog] = useState(blogStructure)
    const [editorState, setEditorState] = useState('editor')
    const [textEditor, setTextEditor] = useState({isReady: false})

    const { userAuth: { token } } = useContext(UserContext)

  return (
    <EditorContext.Provider value={{blog, setBlog, editorState, setEditorState, textEditor, setTextEditor}}>
        {
            token === null ? <Navigate to='/signin' />
            : editorState == 'editor' ? <BlogEditor /> : <PublishForm />
        }
    </EditorContext.Provider>
  )
}

export default Editor

