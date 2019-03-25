document.addEventListener("DOMContentLoaded", function() {

  console.log("this page has loaded with HTML annnnnd Javascript")

  const postsContainer = document.getElementById('posts-container')

  function getAllCats() {
    fetch("http://localhost:3000/api/v1/posts")
    .then(res => res.json())
    .then(cats => {renderAllCats(cats)})
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
            ${cat.likes.length} Likes
          </span>
          <i class="comment icon"></i>
          ${cat.comments.length} comments
        </div>
        <div class="extra content">
          <div class="ui large transparent left icon input">
            <i class="heart outline icon"></i>
            <input type="text" placeholder="Add Comment...">
          </div>
        </div>
      </div>

      `
    })

  }


  getAllCats();







})
