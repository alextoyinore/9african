import React from 'react'

const Img = ({ url, caption }) => {
    return <div className='flex flex-col gap-2'>
        <img src={url} alt={caption} className='aspect-video' />
        {
            caption.length ?
            <p className='w-full text-center italic text-sm text-dark-grey'>{caption}</p> : null
        }
    </div>
}

const Quote = ({ quote, caption }) => {
    return <div className='bg-green/5 p-5 border-l-4 border-green'>
        <p className='text-xl md:text-xl'>{quote}</p>
        {
            caption.length ?
            <p className='w-full italic text-sm text-green'>{caption}</p> : null
        }
    </div>
}

const List = ({ style, items }) => {
    {

        return <ol className={'mx-5 my-4 pl-5 ' + (style == 'ordered' ? ' list-decimal' : 'list-disc')}>
            {
                Object.keys(items).map((key) => {
                    let item = items[key]

                    return item.length ?
                    <li className='py-1.5' key={item}>{item}</li> : null
                })
            }
        </ol>
        
    }
}

const Table = ({ withHeadings, content, caption }) => {
    return <div className='w-full text-xl flex flex-col'>
            <table className='w-full table-auto border-collapse p-5 md:overflow-x-scroll'><tbody className=''>
            {
                content != null && content.length ?
                content.map((item, index) => {

                    return <tr key={index} className={'w-full'}>
                        {
                            item.map((item, index) => {
                                return <td className={'border-collapse border-b border-dark-grey/20 px-5 py-2 '} key={index}>{item}</td>
                            })
                        }
                    </tr>
                }) : null
            }
        </tbody></table>
        {
            caption && caption.length ?
            <p className='w-full italic text-sm text-green'>{caption}</p> : null
        }
    </div>
}

const BlogContent = ({ block }) => {

    let { type, data } = block

    if(type == 'paragraph') {
        return <p dangerouslySetInnerHTML={{__html: data.text}}></p>
    }
    
    if(type == 'header') {
        if(data.level = 3) {
            return <h3 className='text-3xl' dangerouslySetInnerHTML={{__html: data.text}}></h3>
        }
        return <h2 className='text-4xl' dangerouslySetInnerHTML={{__html: data.text}}></h2>
    }
    
    if(type == 'image') {
        return <Img url={data.file.url} caption={data.caption} />
    }

    if(type == 'quote') {
        return <Quote quote={data.text} caption={data.caption} />
    }

    if(type == 'list') {
        return <List style={data.style} items={data.items} />
    }

    if(type == 'table') {
        return <Table withHeadings={data.withHeadings} content={data.content} caption={data?.caption} />
    }
}

export default BlogContent

