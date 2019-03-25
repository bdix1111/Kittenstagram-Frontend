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
          <div class="right floated meta">14h</div>
          <img class="ui avatar image" src="${cat.media}"> Elliot
        </div>
        <div class="image">
          <img>
        </div>
        <div class="content">
          <span class="right floated">
            <i class="heart outline like icon"></i>
            17 likes
          </span>
          <i class="comment icon"></i>
          3 comments
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
