document.addEventListener("DOMContentLoaded", function () {
  displayData(); //displays the first post
  navigationBar(); //functionality to  the harmburger menu
  changeMode(); //changes between lightmode and dark mode
  displayOtherPosts();
  setupReadMoreButtons();
  // double();
  form();
});

function displayData() {
  fetch("https://tech-and-tunez.onrender.com/posts")
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const post = data[0]; // use the first post

        // Log each post for testing
        data.forEach((item) => {
          console.log(item);
          console.log("hellooo");
        });

        // <img>${post.image}</img>
        // Access the home div and update the content using fetched data
        const home = document.getElementById("home");
        home.innerHTML = `
        
          <div class="featured-content">
            <h2>${post.title}</h2>
            <p>${post.excerpt}</p>
            <div class="moreContent" >  
               <p class="moreArticle" >${post.content}</p>
               <span>Written by${post.author}</span>
               <span>${post.date}</span>
               
               <div class="comments-section">
                 <h3>Comments</h3>
                 <ul class="comments-list">
              ${
                post.comments
                  ? post.comments
                      .map((comment) => `<li class="comment">${comment}</li>`)
                      .join("")
                  : ""
              }
            </ul>
            <input type="text" class="comment-input" placeholder="Add a comment...">
            <button class="comment-btn" data-id="${
              post.id
            }">Post Comment</button>
          </div>
          </div>
            </div>
            <a href="#" class="read-more">Read More</a>
          </div>
         
        `;
        setupCommentFunctionality();
        // Create an event listener for the read more button
      }
    });
}

function displayOtherPosts() {
  fetch("https://tech-and-tunez.onrender.com/posts")
    .then((res) => res.json())
    .then((data) => {
      // Skip the first post
      const otherPosts = data.slice(1);

      // Get the tech and music sections from your existing HTML
      const techSection = document.querySelector("#tech .blog-posts");
      const musicSection = document.querySelector("#music .blog-posts");

      // Clear the placeholder articles that are currently in your HTML
      techSection.innerHTML = "";
      musicSection.innerHTML = "";

      // Add each post to the correct section
      otherPosts.forEach((post) => {
        console.log("working");
        const postHTML = `
          <article>
            <img src="${post.image}" alt="${post.title}" />
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="moreContent" style="display: none;">
              <p>${post.content}</p>
              <span>By ${post.author}</span>
              <span>${post.date}</span>
              
            </div>
            <a href="#" class="read-more">Read More</a>

          </article>

          
        `;

        // Add to tech or music section based on category
        if (post.category === "tech") {
          techSection.insertAdjacentHTML("beforeend", postHTML);
        } else if (post.category === "music") {
          musicSection.insertAdjacentHTML("beforeend", postHTML);
        }
      });

      //  read more buttons for the new posts
      setupReadMoreButtons();
    });
}

// Enable comments functionality
function setupCommentFunctionality() {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("comment-btn")) {
      const postId = event.target.getAttribute("data-id");
      const commentInput = event.target.previousElementSibling;
      const newComment = commentInput.value.trim();

      if (newComment !== "") {
        fetch(`https://tech-and-tunez.onrender.com/posts/${postId}`)
          .then((res) => res.json())
          .then((post) => {
            const updatedComments = post.comments
              ? [...post.comments, newComment]
              : [newComment];
            return fetch(
              `https://tech-and-tunez.onrender.com/posts/${postId}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comments: updatedComments }),
              }
            );
          })
          .then(() => {
            const commentList =
              event.target.parentElement.querySelector(".comments-list");
            commentList.insertAdjacentHTML(
              "beforeend",
              `<li class="comment">${newComment}</li>`
            );
            commentInput.value = "";
          });
      }
    }
  });
}

function setupReadMoreButtons() {
  const readMoreButtons = document.querySelectorAll(".read-more");
  readMoreButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const moreContent = button.previousElementSibling; // Assuming .moreContent is right before the button

      if (
        moreContent.style.display === "none" ||
        moreContent.style.display === "" //
      ) {
        moreContent.style.display = "block";
        button.textContent = "Read Less";
      } else {
        moreContent.style.display = "none";
        button.textContent = "Read More";
      }
    });
  });
}

//Adding dark mode / light mode
function changeMode() {
  const darkModeToggle = document.getElementById("darkMode");
  const body = document.body;
  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    darkModeToggle.style = "background-color:white";
    console.log("i was clicked");
  });
}

//nav bar responsive for small screens
function navigationBar() {
  const menu = document.querySelector(".menuToggle");
  const nav = document.querySelector(".nav-container");

  if (menu && nav) {
    menu.addEventListener("click", function () {
      nav.classList.toggle("nav-active");
    });
  }
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    //goes through all the navigation links
    link.addEventListener("click", function () {
      console.log("clicked");
      nav.classList.remove("nav-active");
    });
  });
}

//submitting form
function form() {
  const contactUs = document.getElementById("contact");
  contactUs.addEventListener("submit", submitInfo);

  function submitInfo() {
    event.preventDefault(); //prevent the default behaviour of reloading
    console.log("am clicked");
    alert("Thank youfor your message,ill get back to you in a few"); //an alert to the user
  }
}
