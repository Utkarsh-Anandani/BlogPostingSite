import React, { useEffect, useState } from 'react'
import { formatISO9075 } from 'date-fns'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PostPage = ({ userInfo }) => {
  const [PostInfo, setPostInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`).then(response => {
      response.json().then(info => {
        setPostInfo(info);
      })
    })
  }, [])

  if (PostInfo) {
    return (
      <div className='PostPage'>
        <h1>{PostInfo.title}</h1>
        <div className="PostInfo">
          <p>{formatISO9075(new Date(PostInfo.createdAt)).replace(' ', ' || ')}</p>
          <p>By @{PostInfo.author.username}</p>
        </div>
        <img src={'http://localhost:3000/' + PostInfo.cover.replace('//', '/')} alt="" />
        <div className="PostContent">
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: PostInfo.content }} />
          </div>
          <div className="summary">
            <div className="summaryBox">
              <h2>Summary</h2>
              <p>{PostInfo.summary}</p>
            </div>
          </div>
        </div>
        
        {userInfo ? (userInfo.id === PostInfo.author._id && (
          <Link to={`/edit/${PostInfo._id}`} className='editButton'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit Blog
          </Link>
        )) : ('')}
      </div>
    )
  }
  else {
    return <h1>No Information Available regarding this Blog</h1>
  }
}

export default PostPage

//<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
{/* <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg> */}

{/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
<path d="M46.6,3.4c-1-1-2.2-1.4-3.4-1.4c-1.2,0-2.5,0.5-3.4,1.4c0,0-0.1,0.1-0.2,0.2c0,0,0,0,0,0L4.3,38.8c-0.1,0.1-0.2,0.3-0.3,0.4	l-2,7.5c-0.1,0.3,0,0.7,0.3,1C2.5,47.9,2.7,48,3,48c0.1,0,0.2,0,0.3,0l7.5-2c0.2,0,0.3-0.1,0.4-0.3l35.2-35.2c0,0,0,0,0,0	c0.1-0.1,0.2-0.2,0.2-0.2C48.5,8.4,48.5,5.3,46.6,3.4z M45.2,4.8c1.1,1.1,1.1,2.9,0,4.1c-0.3,0.3-0.6,0.6-0.9,0.9l-4.1-4.1	c0.5-0.5,0.9-0.9,0.9-0.9c0.5-0.5,1.3-0.8,2-0.8C43.9,4,44.6,4.3,45.2,4.8z M5.6,41.2l3.2,3.2l-4.4,1.2L5.6,41.2z"></path>
</svg> */}

