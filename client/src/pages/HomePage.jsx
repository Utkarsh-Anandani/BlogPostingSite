import React, { useEffect, useState } from 'react'
import Blog from '../components/Blog'

const HomePage = () => {
  const [posts, setposts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/post').then(response =>{
      response.json().then(posts => {
        setposts(posts);
      })
    })
  }, [])
  
  return (
    <div className="blogs">
        {posts.length > 0 &&
        posts.map(post => {
          return <Blog key={post._id} {...post}/>
        })
        }
    </div>
  )
}

export default HomePage