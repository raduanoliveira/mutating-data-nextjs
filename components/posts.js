'use client'
import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import { togglePostLikeStatus } from '@/actions/posts';
import { useOptimistic } from 'react';
import Image from 'next/image';

function imageLoader(config) {
  const urlStart = config.src.split('upload/')[0]
  const urlEnd = config.src.split('upload/')[1]
  const transformations = `w_200,q_${config.quality}`
  const retorno = `${urlStart}upload/${transformations}/${urlEnd}`
  return retorno
}
function Post({ post, action }) {
  return (
    <article className="post">
      <div className="post-image">
        <Image loader={imageLoader} src={post.image} width={200} height={120} alt={post.title} quality={50} sizes='' />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form action={action.bind(null, post.id)} className={post.isLiked ? 'liked' : ''}>
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  const [optmisticPosts, updateOptmisticPosts] = useOptimistic(posts, (prevPosts, updatedPostId) => {
    const updatedPostIndex = prevPosts.findIndex(post => post.id === updatedPostId)
    if (updatedPostId === -1) {
      return prevPosts
    }
    const updatedPost = { ...prevPosts[updatedPostIndex] }
    updatedPost.likes = updatedPost.liks + (updatedPost.isLiked ? -1 : 1)
    updatedPost.isLiked = !updatedPost.isLiked
    const newPosts = [...prevPosts]
    newPosts[updatedPostIndex] = updatedPost
    return newPosts
  })
  if (!optmisticPosts || optmisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatePost(postId) {
    updateOptmisticPosts(postId)
    await togglePostLikeStatus(postId)
  }

  return (
    <ul className="posts">
      {optmisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
