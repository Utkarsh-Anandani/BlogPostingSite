import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useParams } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }],
    ["link", "image"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const EditBlog = () => {
  const { id } = useParams();
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [content, setcontent] = useState("");
  const [files, setfiles] = useState("");
  const [redirect, setredirect] = useState(false);

  useEffect(() => {
    fetch(`https://blogpostingsite.onrender.com/post/${id}`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((info) => {
        settitle(info.title);
        setsummary(info.summary);
        setcontent(info.content);
      });
    });
  }, []);

  const updateBlog = async (e) => {
    e.preventDefault();

    if (files && files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]); // Read file as Base64
      reader.onloadend = async () => {
        const base64String = reader.result;
        const response = await fetch("https://blogpostingsite.onrender.com/post", {
          method: "PUT",
          headers : {'Content-Type' : 'application/json'},
          body: JSON.stringify({id, title, summary, content, image: base64String}),
          credentials: "include",
        });

        if (response.ok) {
          setredirect(true);
        }
      };
    } else {
      const response = await fetch("https://blogpostingsite.onrender.com/post", {
        method: "PUT",
        headers : {'Content-Type' : 'application/json'},
        body: JSON.stringify({id, title, summary, content}),
        credentials: "include",
      });

      if (response.ok) {
        setredirect(true);
      }
    }
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form className="writeBlog" action="" onSubmit={updateBlog}>
      <h1>
        <span className="blue">Write</span> Blog
      </h1>

      <input
        type="title"
        className="input"
        placeholder="Title for the Blog"
        value={title}
        onChange={(e) => {
          settitle(e.target.value);
        }}
      />

      <input
        type="summary"
        className="input"
        placeholder="Summary of the Blog"
        value={summary}
        onChange={(e) => {
          setsummary(e.target.value);
        }}
      />

      <input
        className="file"
        type="file"
        onChange={(e) => {
          setfiles(e.target.files);
        }}
      />

      <ReactQuill
        value={content}
        modules={modules}
        formats={formats}
        onChange={(newValue) => {
          setcontent(newValue);
        }}
      />

      <button className="postButton" type="submit">
        Update Blog
      </button>
    </form>
  );
};

export default EditBlog;
