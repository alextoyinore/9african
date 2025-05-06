import React, { useContext, useState, createContext, useEffect } from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom'
import BlogEditor from '../components/BlogEditor'
import PublishForm from '../components/PublishForm'
import Loader from '../components/Loader'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

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

    let  { blog_id } = useParams()

    const [blog, setBlog] = useState(blogStructure)
    const [editorState, setEditorState] = useState('editor')
    const [textEditor, setTextEditor] = useState({isReady: false})
    
    const [ loading, setLoading ] = useState(true)

    const { userAuth: { token } } = useContext(UserContext)

    useEffect(() => {
      
      if(!blog_id) {
        return setLoading(false)
      }

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', { blog_id, draft: true, mode: 'edit' })
      .then(({data: { blog }}) => {

          setBlog(blog)

          setLoading(false)
      })
      .catch(err => {
          setBlog(null)
          setLoading(false)
          toast.error(err.message)
      })

    }, [])

    return (
      <EditorContext.Provider value={{blog, setBlog, editorState, setEditorState, textEditor, setTextEditor}}>
        <Toaster />
          {
              token === null ? <Navigate to='/signin' />
              : loading ? <Loader />
              : editorState == 'editor' ? <BlogEditor /> 
              : <PublishForm />
          }
      </EditorContext.Provider>
    )
}

export default Editor

