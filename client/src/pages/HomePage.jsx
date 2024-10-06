import React, { useEffect, useState } from 'react'
import Blog from '../components/Blog'
import Loader from '../components/Loader';

const HomePage = () => {
  const [posts, setposts] = useState([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://blog-posting-site-server.vercel.app/post').then(response =>{
      response.json().then(posts => {
        setposts(posts);
        setLoading(false);
      })
    })
  }, [])
  
  return (
    <div className="blogs">
      {Loading ? <Loader /> : ''}
        {posts.length > 0 &&
        posts.map(post => {
          return <Blog key={post._id} {...post}/>
        })
        }
    </div>
  )
}

export default HomePage