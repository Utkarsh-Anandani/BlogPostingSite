import React from 'react'
import { formatISO9075 } from 'date-fns'
import { Link } from 'react-router-dom'

const Blog = ({ _id, title, summary, content, cover, createdAt, author }) => {
  console.log(cover)
  return (
    <div className="blog">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:3000/' + cover} /> {/*.replace('//', '/')*/}
        </Link>
      </div>
      <div className="text">
        <h2>
          <Link to={`/post/${_id}`}>
            {title}
          </Link>
        </h2>
        <div className="info">
          <p className="author">{author.username}</p>
          <p className="date">{formatISO9075(new Date(createdAt)).replace(" ", ` || `)}</p>
        </div>
        <p>
          {summary}
        </p>
      </div>
    </div>
  )
}

export default Blog
