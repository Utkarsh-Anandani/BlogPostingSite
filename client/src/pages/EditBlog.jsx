import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate, useParams } from 'react-router-dom'

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike',],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' },],
    ['link', 'image']
  ]
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'image',
]

const EditBlog = () => {
  const { id } = useParams();
  const [title, settitle] = useState('')
  const [summary, setsummary] = useState('')
  const [content, setcontent] = useState('')
  const [files, setfiles] = useState('')
  const [redirect, setredirect] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`).then(response => {
      response.json().then(info => {
        settitle(info.title);
        setsummary(info.summary);
        setcontent(info.content);
      })
    })
  }, [])


  const updateBlog = async (ev) => {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('files', files[0]);
    }
    const response = await fetch('http://localhost:3000/post', {
      method: 'PUT',
      body: data,
      credentials: "include",
    })

    if(response.ok){
      setredirect(true);
    }

  }

  if(redirect){
    return <Navigate to={`/post/${id}`}/>
  }

  return (
    <form className='writeBlog' action="" onSubmit={updateBlog}>

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


      <button className='postButton' type="submit">Update Blog</button>

    </form>
  )
}

export default EditBlog
