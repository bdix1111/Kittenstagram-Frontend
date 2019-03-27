document.addEventListener("DOMContentLoaded", function() {

  console.log("this page has loaded with HTML annnnnd Javascript")

  const postsContainer = document.getElementById('posts-container')
  const commentViewerBtn = document.getElementById('comment-viewer-btn')
  const likeButton = document.getElementById('like-button')
  // const newCommentInput = document.getElementById('new-comment-input')
  // const likeCount = document.getElementById('like-count')


  function getAllCats() {
    fetch("http://localhost:3000/api/v1/posts")
      .then(res => res.json())
      .then(cats => {
        renderAllCats(cats)
      })
  }

  function renderAllCats(cats) {
    postsContainer.innerHTML = ''

    cats.forEach(function(cat) {

      postsContainer.innerHTML += `
      <div class="flip-card" id="cat-card-${cat.id}">
        <div class="flip-card-inner">

          <div class="flip-card-front" id="cat-card-front-${cat.id}">
            <div class="ui card">
              <div class="content">
                <h2>${cat.name}</h2>
              </div>
              <div class="image">
                <img src=${cat.media}>
              </div>
              <div class="content">
                <span class="right floated">
                  <i class="heart outline icon"></i>
                  <span id="like-count-${cat.id}">${cat.likes.length} Likes</span>
                </span>
                <span>
                  <i class="comment icon"></i>
                  <span id="comment-count-${cat.id}" data-id=${cat.id}>${cat.comments.length} comments</span>
                </span>
              </div>
              <div class="extra content">
                <div class="ui large transparent left icon input">
                  <span>
                    <i id="like-button-${cat.id}" class="heart like icon" data-id=${cat.id}></i>
                  </span>
                  <input id="new-comment-input-${cat.id}" data-id="${cat.id}" type="text" placeholder="Add Comment...">
                </div>
              </div>
            </div>
          </div>
          <div class="flip-card-back" id="cat-card-back-${cat.id}" data-id=${cat.id}>
            <br>
            <h2>${cat.name}</h2>
            <br>
            ${cat.comments.map(function(comment) {
              return `<p>${comment.content}</p>`
            }).join("")}
          </div>
        </div>
      </div>
      `
    })

  }


  getAllCats();

  postsContainer.addEventListener('click', function(e) {
    console.log('clicked', e.target.id)
    const postId = parseInt(e.target.dataset.id)
    console.log(postId);

    if (e.target.id === `like-button-${postId}`) {
      let likeCount = document.getElementById(`like-count-${postId}`)
      let likeNum = parseInt(likeCount.innerText)
        ++likeNum
      likeCount.innerText = likeNum + ' Likes'
      //conCATenation

      addLikeToPost(postId)

    } else if (e.target.id === `comment-count-${postId}`) {
      const commentClicker = document.getElementById(`cat-card-${postId}`)
      const cardFront = document.getElementById(`cat-card-front-${postId}`)

      commentClicker.classList.toggle("flipper")
      // cardFront.style.display = "none"
      // getPost(postId).then(post => renderComments(post))
    }
    if (e.target.id === `cat-card-back-${postId}`) {
      console.log("clicked backside")
      const commentUnClicker = document.getElementById(`cat-card-${postId}`)

      commentUnClicker.classList.toggle("flipper")
    }
  })

  postsContainer.addEventListener('keypress', function(e) {
    const postId = parseInt(e.target.dataset.id)
    const newCommentInput = document.getElementById(`new-comment-input-${postId}`)
    const newComment = newCommentInput.value

    if (e.keyCode === 13 && newComment !== "") {

      let commentCount = document.getElementById(`comment-count-${postId}`)
      let commentNum = parseInt(commentCount.innerText)
        ++commentNum
      commentCount.innerText = commentNum + ' comments' //conCATenate dat ish

      addCommentToPost(postId, newComment)
      newCommentInput.value = ""
    }
  })



  function addLikeToPost(postId) {
    fetch("http://localhost:3000/api/v1/likes", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        post_id: postId
      })
    }).then(res => res.json())
  }


  function addCommentToPost(postId, newComment) {
    fetch("http://localhost:3000/api/v1/comments", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        post_id: postId,
        content: newComment
      })
    }).then(res => res.json)
  }

  function getPost(postId) {
    return fetch(`http://localhost:3000/api/v1/posts/${postId}`)
      .then(res => res.json())
      // .then(post => console.log(post.comments))
  }

  function renderComments(post) {
    post.comments.forEach(function(comment) {
      postsContainer.innerHTML += `${comment.content}`
    })
  }


})
