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

    const postBlog = async (e) => {
        e.preventDefault();
      
        // Convert the file to a Base64 string if a file is selected
        if (files && files[0]) {
          const reader = new FileReader();
          reader.readAsDataURL(files[0]); // Read file as Base64
          reader.onloadend = async () => {
            const base64String = reader.result; // Contains the Base64 encoded image
      
            // Add other fields to the request body
            console.log(title, summary, content)
      
            // Send the POST request
            const response = await fetch('https://blog-posting-site.vercel.app/post', {
              method: 'POST',
              headers : {'Content-Type' : 'application/json'},
              body: JSON.stringify({ title, summary, content, image: base64String }),
              credentials: 'include', // Include cookies if needed
            });
      
            if (response.ok) {
              setredirect(true);
            } else {
              console.error('Failed to post blog');
            }
          };
        }
      };
      

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
