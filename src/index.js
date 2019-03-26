document.addEventListener("DOMContentLoaded", function() {

  console.log("this page has loaded with HTML annnnnd Javascript")

  const postsContainer = document.getElementById('posts-container')
  const commentViewerBtn = document.getElementById('comment-viewer-btn')
  const likeButton = document.getElementById('like-button')
  const newCommentInput = document.getElementById('new-comment-input')
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
      <div class="ui card">
        <div class="content">
          <h2>${cat.name}</h2>
        </div>
        <div class="image">
          <img src=${cat.media}>
        </div>
        <div class="content">
          <span class="right floated">
            <i class="heart outline like icon"></i>
            <span id="like-count-${cat.id}">${cat.likes.length} Likes</span>
          </span>
          <span id="comment-viewer-btn" data-id=${cat.id}>
          <i class="comment icon"></i>
          ${cat.comments.length} comments
          </span>
        </div>
        <div class="extra content">
          <div class="ui large transparent left icon input">
            <span>
              <i id="like-button" class="heart outline icon" data-id=${cat.id}></i>
            </span>
            <input id="new-comment-input" type="text" data-id=${cat.id} placeholder="Add Comment...">
          </div>
        </div>
      </div>

      `
    })

  }


  getAllCats();

  postsContainer.addEventListener('click', function(e) {
    if(e.target.id === 'like-button') {
      const postId = parseInt(e.target.dataset.id)
      let likeCount = document.getElementById(`like-count-${postId}`)
      let likeNum = parseInt(likeCount.innerText)
      ++likeNum
      likeCount.innerText = likeNum + ' Likes'
      //conCATenation

      addLikeToPost(postId)
    } else if (e.target.id === 'comment-viewer-btn') {
      console.log('clicked', e.target.dataset.id)
    }
  })



  function addLikeToPost(postId) {
    console.log(postId)
    fetch("http://localhost:3000/api/v1/likes", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          post_id: postId
        })
      }).then(res => res.json())
      .then(console.log('like added'))
  }




})
