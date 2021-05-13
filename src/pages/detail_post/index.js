import MainTemplate from '../../layouts/MainLayout'
import BreadCumb from '../../components/BreadCrumb'
import { Link, useHistory, useParams } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import api from '../../utils/axios'
import { useState, useEffect, useRef } from 'react'
import { date } from '../../utils'
import getImage from '../../utils/getImage'
import { connect } from 'react-redux'

const DetailEl = (props) => {
  const { web } = props
  const isAdmin = web.user.role

  const history = useHistory()
  const [post, setPost] = useState({})
  const [cmtLoading, setCmtLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [relatedPosts, setRelatedPosts] = useState([])

  const { title } = useParams()
  const commentEl = useRef(null)

  useEffect(() => {
    //get page
    props.dispatch({ type: 'TOGGLE_LOADING', payload: true })

    api('GET', `api/posts/${title}`)
      .then(res => {
        if (res.data && res.data.status) {
          const postData = res.data.post
          if (postData.like.filter(x => x._id === web.user.userId).length > 0) {
            postData.liked = true
          }
          setPost(postData)
          
          return res.data.post
        } else {
          console.log('err')
        }
      })
      .then((post) => {
        console.log(post)
        api('GET', `api/posts/comment/${post._id}?page=${1}`)
          .then(res2 => {
            if (res2.data && res2.data.status) {
              setComments(res2.data.comments)
            }
          })
        return post
      })
      .then((post) => {
        const categoryId = post.category && post.category._id || null
        api('GET', `api/posts/v1/filter?category=${categoryId}`)
          .then(res => {
            if (res.data && res.data.status) {
              setRelatedPosts(res.data.relatedPost)
            }
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
      .then(() => {
        props.dispatch({ type: 'TOGGLE_LOADING', payload: false })
      })
  }, [])

  const getComment = (postId) => {
    setCmtLoading(true)
    api("GET", `api/posts/comment/${postId}?page=${1}`)
      .then(res => {
        if (res.data && res.data.status) {
          if (res.data.comments && res.data.comments.length > 0) {
            setComments(res.data.comments)
          }
        } else {
          setComments([])
        }
      })
      .catch(err => console.log(err))
      .then(() => {
        setCmtLoading(false)
      })
  }
  const deleteComment = (commentId) => {
    console.log(commentId)
    api('GET', `api/posts/u/delete-comment?commentId=${commentId}&postId=${post._id}&userId=${web.user.userId}`)
      .then(res => {
        if (res.data && res.data.status) {
          let commentCount = [...post.comment]
          commentCount = commentCount.filter(x => x._id !== commentId)

          const newPostData =
          {
            ...post,
            comment: commentCount
          }

          setPost(newPostData)

          getComment(post._id)
        }
      })
  }

  const sendComment = () => {
    setCmtLoading(true)
    const value = commentEl.current.value

    const postData = {
      postId: post._id,
      content: value
    }

    api('POST', `/api/posts/comment/${post._id}`, postData)
      .then(res => {
        if (res.data && res.data.status) {
          commentEl.current.value = ''
          const newId = String(res.data.newCommentId)
          let newComtList = comments
          if (comments.length > 3)
            newComtList = comments.slice(1)
          setComments(
            [
              ...newComtList,
              {
                user: {
                  _id: web.user.userId,
                  firstName: web.user.firstName,
                  lastName: web.user.lastName,
                  image: web.user.userImage
                },
                ...postData,
                _id: newId
              }
            ]
          )
        } else {
          if (res.data.message === 'vui long dang nhap') {
            history.replace({ pathname: '/sign-in' })
          }
        }
      })
      .catch(err => console.log(err))
      .then(() => setCmtLoading(false))
  }

  const like = () => {
    api('POST', `api/posts/like/${post._id}`)
      .then(res => console.log('liked'))
  }

  const unlike = () => {
    api('POST', `api/posts/unlike/${post._id}`)
      .then(res => console.log('unliked'))
  }

  const likeHandle = (likeList) => {
    const userId = web.user.userId

    const result = likeList.filter(e => e._id === userId).length > 0
    if (result) {
      unlike()
      const newLikeList = likeList.filter(e => e._id !== userId)
      setPost({
        ...post,
        liked: false,
        like: newLikeList
      })
    } else {
      like()
      likeList.push({ postId: post._id, _id: userId })
      setPost({
        ...post,
        liked: true,
        like: likeList
      })
    }
  }

  return (
    <MainTemplate>
      <div id='post-detail'>
        <BreadCumb category={post.category && post.category.name || 'Đang cập nhật'} detail={post.title} />

        <div className='detail-container'>
          <div className='row'>
            <div className='col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9'>
              <div className='detail-create-date'>
                <i className="far fa-clock"></i>
                <span>{date(post.createDate)}</span>
              </div>
              <div className='detail-create-date'>
                <i className="fas fa-hashtag"></i>
                <span>{post.category && post.category.name || 'Đang cập nhật...'}</span>
              </div>
              <div className='detail-author'>
                <i className="far fa-user"></i>
                <Link to='/'>
                  {post.author && `${post.author && post.author.firstName} ${post.author && post.author.lastName}` || "Đang cập nhật..."}
                </Link>
              </div>
              <div className='detail-title'>
                <h1 className='title'>
                  {post.title}
                </h1>
              </div>
              <div className='detail-short-description'>
                <h5>
                  {post.description}
                </h5>
              </div>
              <div className='detail-img-wrapper'>
                <img width='100%' src={getImage(post.image)} />
              </div>
              <div className='detail-content'>
                <div className='content-html' dangerouslySetInnerHTML={{ __html: post.content }}>

                </div>
              </div>
              {
                post.source !== 'null' &&
                <p style={{ opacity: 0.7, fontSize: '0.9rem', fontStyle: 'italic', marginTop: 20, display: 'block', textAlign: 'right' }}>Nguồn: {post.source || null}</p>
              }
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3'>
              <div className='detail-tools-container'>
                <button className='like' onClick={() => likeHandle(post.like)}>
                  {
                    post.liked &&
                    <>
                      <i className="fas fa-heart"></i>
                      <span>{`You ${post.like && post.like.length > 1 ? `and ${post.like && post.like.length - 1} others` : ''}`}</span>
                    </>
                    ||
                    <>
                      <i className="far fa-heart"></i>
                      <span>{`${post.like && post.like.length === 0 ? `Like this post` : `${post.like && post.like.length} people`}`}</span>
                    </>
                  }
                </button>
                <button className='share'>
                <a href={`http://www.facebook.com/share.php?u=${ window.location.href }`} target='_blank'>
                  <i className="fas fa-share"></i>
                </a>
                </button>
              </div>
              <div className='comments'>
                <div className='comment-list'>
                  {
                    comments && comments.length > 0 &&
                    <ul>
                      {
                        comments.map(item => (
                          <li key={item._id} className='comment-item'>
                            {(isAdmin === 'admin' || (item.user && item.user._id === web.user.userId)) && <button onClick={() => deleteComment(item._id)} className='postList-delete-comt'><i className="far fa-trash-alt"></i></button>}
                            <div className='comment-author'>
                              <Link to='/'>
                                <img src={getImage(item.user && item.user.image)} />
                              </Link>
                              <Link to='/'>
                                {`${item.user && item.user.firstName} ${item.user && item.user.lastName}`}
                              </Link>

                            </div>
                            <div className='comment-content'>
                              <p>
                                {item.content}
                              </p>
                            </div>
                          </li>
                        ))
                      }
                      {
                        cmtLoading &&
                        <li className='detail-comment-loading'>
                          <img src='/images/cmtloading.gif' />
                        </li>
                      }
                    </ul>
                    ||
                    <p className='detail-comemnt-list comment-alert'>There are not any comment. write your mind?</p>
                  }
                </div>
                <div className='user-comment'>
                  <img src={getImage(web.user.userImage)} />
                  <div className='comment-input-container'>
                    <TextareaAutosize ref={commentEl} placeholder='comment...' className='comment-input' />
                    <button onClick={sendComment}>
                      <i className="far fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
              {
                relatedPosts && relatedPosts.length > 1 &&
                <div className='detail-relation-container'>
                  <p class='relate'>Related posts</p>
                  <ul>
                    {
                      relatedPosts.map((item, index) => {
                        if (item._id !== post._id && index <= 5) {
                          return (
                            <li key={item._id}>
                              <div className='detail-relate-item-container'>
                                <div className='detail-relate-thumb'>
                                  <a href={`/posts/${item.slug}`}>
                                    <img src={getImage(item.image)} />
                                  </a>
                                </div>
                                <div className='detail-relate-info'>
                                  <a href={`/posts/${item.slug}`}>
                                    <h2>
                                      {item.title}
                                    </h2>
                                  </a>
                                  <div className='detail-relate-author'>
                                    <i className="far fa-user"></i>
                                    <span>{`${item.author && item.author.firstName} ${item.author && item.author.lastName}`}</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        }
                      })
                    }
                  </ul>
                  <Link to='/' class='more'>see more</Link>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </MainTemplate >
  )
}
const mapStateToProps = (state) => ({
  web: state.web
})
const Detail = connect(mapStateToProps)(DetailEl)
export default Detail
