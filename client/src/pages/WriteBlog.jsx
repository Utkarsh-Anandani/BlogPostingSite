import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike',],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' },],
        ['link', 'image'],
        ['clean'],
    ]
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image',
]

const WriteBlog = () => {
    const [title, settitle] = useState('')
    const [summary, setsummary] = useState('')
    const [content, setcontent] = useState('')
    const [files, setfiles] = useState('')
    const [redirect, setredirect] = useState(false)

    const postBlog = async (e)=>{
        e.preventDefault();
        const data = new FormData();
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('files', files[0])
        console.log(files[0])
        e.preventDefault();
        const response = await fetch('http://localhost:3000/post',{
            method: 'POST',
            body: data,
            credentials: 'include',
        })
        if(response.ok){
            setredirect(true)
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <form className='writeBlog' action="" onSubmit={postBlog}>

            <h1><span className='blue'>Write</span> Blog</h1>
            
            <input type="title"
                className="input"
                placeholder="Title for the Blog"
                value={title}
                onChange={(e) => {
                    settitle(e.target.value)
                }}
            />

            <input type="summary"
                className="input"
                placeholder="Summary of the Blog"
                value={summary}
                onChange={(e) => {
                    setsummary(e.target.value)
                }}
            />

            <input
            className='file'
            type="file" 
            onChange={(e) => {
                setfiles(e.target.files)
            }}
            />

            <ReactQuill
                value={content}
                modules={modules}
                formats={formats}
                onChange={newValue => {
                    setcontent(newValue)
                }}
            />


            <button className='postButton' type="submit">Post Blog</button>

        </form>
    )
}

export default WriteBlog
