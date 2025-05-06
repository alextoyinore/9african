/**
 * For importing EditorJS tools
 */

import Embed from '@editorjs/embed'
import Link from '@editorjs/link'
import Code from '@editorjs/code'
import Marker from '@editorjs/marker'
import Header from '@editorjs/header'
import InlineCode from '@editorjs/inline-code'
import Image from '@editorjs/image'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import { uploadImage } from '../common/aws'
import toast from 'react-hot-toast'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import Raw from '@editorjs/raw'
import { cloudinaryImageUpload } from '../common/cloudinary'

const uploadImageByUrl = async (e) => {
    const link = await new Promise((resolve, reject) => {
        try{
            resolve(e)
        }catch(err) {
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}

const uploadImageByFile = async (e) => {
    return await cloudinaryImageUpload(e)
    .then(url => {
        if(url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
    .catch(err => {
        toast.error(err)
    })
}

export const Tools = {
    header: {
        class: Header,
        config: {
            placeholder: 'Section Heading...',
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    link: Link,
    list: {
        class: List,
        inlineToolbar: true
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    embed: Embed,
    marker: Marker,
    code: Code,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile
            }
        }
    },
    table: Table,
    inlineCode: InlineCode,
    raw: Raw,
    warning: Warning
}

