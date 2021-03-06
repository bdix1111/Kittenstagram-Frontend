document.addEventListener("DOMContentLoaded", function() {

  document.addEventListener('click', (e) => {
    console.log("clicked", e.target.id)
  })

  const nav = document.querySelector('#navigation');
  const navTop = nav.offsetTop;

  const postsContainer = document.getElementById('posts-container')
  const commentViewerBtn = document.getElementById('comment-viewer-btn')
  const likeButton = document.getElementById('like-button')
  const submitButton = document.getElementById('new-post-submit')
  const newCatForm = document.getElementById("new-cat-form")

  const modal = document.getElementById('myModal')
  const modalBtn = document.getElementById("formModalBtn add-cat-button")
  const span = document.getElementsByClassName("close")[0]

  // const newCommentInput = document.getElementById('new-comment-input')
  // const likeCount = document.getElementById('like-count')

  //modal functionality
  modalBtn.onclick = function() {
    modal.style.display = "block";
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  function stickyNavigation() {
    if (window.scrollY >= navTop) {
      // document.body.style.paddingTop = nav.offsetHeight + 'px';
      document.body.classList.add('fixed-nav');
    } else {
      document.body.style.paddingTop = 0;
      document.body.classList.remove('fixed-nav');
    }
  }

  window.addEventListener('scroll', () => {
    stickyNavigation();
  });


  function getAllCats() {
    fetch("http://localhost:3000/api/v1/posts")
      .then(res => res.json())
      .then(cats => {
        renderAllCats(cats)
      })
  }

  function renderAllCats(cats) {
    postsContainer.innerHTML = ''

    cats.sort((a,b) => b.id - a.id)
    cats.forEach(function(cat) {
      // console.log(cat.created_at)
      postsContainer.innerHTML +=
      `
      <div class="flip-card" id="cat-card-${cat.id}">
        <div class="flip-card-inner">

          <div class="flip-card-front" id="cat-card-front-${cat.id}">
            <div class="ui card">
              <div class="content">
                <h1>${cat.name}</h1>
              </div>
              <div class="image">
                <img src=${cat.media}>
              </div>
              <div class="content"
                <p>${cat.caption}</p>
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
            <h1>${cat.name}</h1>
            <br>
            ${cat.comments.map(function(comment) {
              return `<p>${comment.content}</p>`
            }).join("")}
          </div>
        </div>
      </div>
      <br>
      <br>
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
      const cardBack = document.getElementById(`cat-card-back-${postId}`)

      commentClicker.classList.toggle("flipper")
      cardBack.classList.toggle("scroll")
      // cardFront.style.display = "none"
      // getPost(postId).then(post => renderComments(post))
    }
    if (e.target.id === `cat-card-back-${postId}`) {
      console.log("clicked backside")
      const commentUnClicker = document.getElementById(`cat-card-${postId}`)
      const cardBack = document.getElementById(`cat-card-back-${postId}`)

      commentUnClicker.classList.toggle("flipper")
      cardBack.classList.toggle("scroll")
    }
  })

  postsContainer.addEventListener('keypress', function(e) {
    const postId = parseInt(e.target.dataset.id)
    const newCommentInput = document.getElementById(`new-comment-input-${postId}`)
    const newComment = newCommentInput.value

    if (e.keyCode === 13 && newComment !== "") {

      const commentCard = document.getElementById(`cat-card-back-${postId}`)
      let commentCount = document.getElementById(`comment-count-${postId}`)
      let commentNum = parseInt(commentCount.innerText)
        ++commentNum
      commentCount.innerText = commentNum + ' comments' //conCATenate dat ish
      commentCard.innerHTML += `
        <p>${newComment}</p>
      `
      addCommentToPost(postId, newComment)
      newCommentInput.value = ""
    }
  })

  function createCat(catName, catMedia, catCaption) {
    fetch("http://localhost:3000/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: catName,
          media: catMedia,
          caption: catCaption
        })
      }).then(res => res.json())
      .then(getAllCats)
  }

  submitButton.addEventListener('click', function(e) {
    e.preventDefault()
    const catName = document.getElementById('cat-name').value
    const catMedia = document.getElementById('cat-image').value
    const catCaption = document.getElementById('post-description').value

    modal.style.display = "none";
    createCat(catName, catMedia, catCaption)
    newCatForm.reset()
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
