document.addEventListener("DOMContentLoaded", function () {
  displayData(); //displays the first post
  navigationBar(); //functionality to  the harmburger menu
  changeMode(); //changes between lightmode and dark mode
  displayOtherPosts();
  setupCommentFunctionality();
  setupReadMoreButtons();
  addBlog();
  // addBlogToPage();
  // double();
  form();
});

{
  /* <img src="${post.image}" alt="${post.title}" /> */
}
function displayData() {
  fetch("https://tech-and-tunez.onrender.com/posts")
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const post = data[0]; // First post

        const home = document.getElementById("home");
        console.log(home);

        home.innerHTML = `
          <div class="featured-content">
         
            <h2>${post.title}</h2>
            <p>${post.excerpt}</p>
            <div class="moreContent" style="display: none;">  
               <p class="moreArticle">${post.content}</p>
               <span>Written by ${post.author}</span>
               <span>${post.date}</span>
               <div class="comments-section">
                 <h3>Comments</h3>
                 <ul class="comments-list">
                    ${
                      post.comments
                        ? post.comments
                            .map(
                              (comment, index) => `
                        <li class="comment">
                          ${comment} 
                          <button class="delete-comment" data-id="${post.id}" data-index="${index}">❌</button>
                        </li>`
                            )
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
            <a href="#" class="read-more">Read More</a> <!-- BUTTON INSIDE -->
          </div>
        `;

        setupReadMoreButtons(); // Attach event listener
        setupCommentFunctionality();
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
        <div class="blog-posts">
          <article>
            <img src="${post.image}" alt="${post.title}" />
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="moreContent" style="display: none;">
              <p>${post.content}</p>
              <span>By ${post.author}</span>
              <span>${post.date}</span>
              
               <div class="comments-section">
                 <h3>Comments</h3>
                 <ul class="comments-list">
                    ${
                      post.comments
                        ? post.comments
                            .map(
                              (comment, index) => `
                        <li class="comment">
                          ${comment} 
                          <button class="delete-comment" data-id="${post.id}" data-index="${index}">❌</button>
                        </li>`
                            )
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
            <a href="#" class="read-more">Read More</a>

          </article>

          </div>
        `;

        // Add to tech or music section based on category
        if (post.category === "tech") {
          techSection.insertAdjacentHTML("beforeend", postHTML);
        } else if (post.category === "music") {
          musicSection.insertAdjacentHTML("beforeend", postHTML);
        }
      });
      setupCommentFunctionality();
      //  read more buttons for the new posts
      setupReadMoreButtons();
    });
}

// Enable comments functionality
function setupCommentFunctionality() {
  document.removeEventListener("click", handleCommentClick);
  document.addEventListener("click", handleCommentClick);
}

function handleCommentClick(event) {
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
          return fetch(`https://tech-and-tunez.onrender.com/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comments: updatedComments }),
          });
        })
        .then(() => {
          const commentList =
            event.target.parentElement.querySelector(".comments-list");
          commentList.insertAdjacentHTML(
            "beforeend",
            `<li class="comment">${newComment} <button class="delete-comment" data-id="${postId}" data-index="${commentList.children.length}">delete</button></li>`
          );
          commentInput.value = "";
        })
        .catch((error) => console.error("Error updating comments:", error));
    }
  }

  if (event.target.classList.contains("delete-comment")) {
    const postId = event.target.getAttribute("data-id");
    const commentIndex = event.target.getAttribute("data-index");

    fetch(`https://tech-and-tunez.onrender.com/posts/${postId}`)
      .then((res) => res.json())
      .then((post) => {
        const updatedComments = post.comments.filter(
          (_, index) => index != commentIndex
        );
        return fetch(`https://tech-and-tunez.onrender.com/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comments: updatedComments }),
        });
      })
      .then(() => {
        event.target.parentElement.remove(); // Remove from UI
      })
      .catch((error) => console.error("Error deleting comment:", error));
  }
}

function setupReadMoreButtons() {
  document.body.addEventListener("click", function (event) {
    console.log("clicked");
    if (event.target.classList.contains("read-more")) {
      event.preventDefault();

      // Find the closest parent post container
      const postContainer = event.target.closest(".featured-content, article");
      if (!postContainer) return;

      // Find the moreContent section inside the post
      const moreContent = postContainer.querySelector(".moreContent");
      console.log(moreContent);
      if (moreContent) {
        if (
          moreContent.style.display === "none" ||
          moreContent.style.display === ""
        ) {
          moreContent.style.display = "block";
          event.target.textContent = "Read Less";
        } else {
          moreContent.style.display = "none";
          event.target.textContent = "Read More";
        }
      }
    }
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
//adding blog section
function addBlog() {
  const form = document.querySelector("#blogForm");

  if (!form) {
    console.error("Form not found!");
    return;
  }

  console.log(`am working ${form}`);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("clicked");

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const contentElement = document.getElementById("content");
    const content = contentElement ? contentElement.value : "";
    const image = document.getElementById("image").value;
    const date = new Date().toLocaleDateString();

    // Creating a blog object
    const newPost = {
      title,
      author,
      date,
      category,
      content,
      image,
      comments: [],
      excerpt: content ? content.substring(0, 100) + "..." : "", // Short preview
    };

    // Sending it to the server
    fetch("https://tech-and-tunez.onrender.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("new post data", data);
        if (data && data.category) {
          alert("Blog added successfully");
          addBlogToPage(data); // Update UI
          document.getElementById("blogForm").reset();
        } else {
          console.error("received invalid data", data);
        } // Clear form fields
      });
  });
}

//adding blog to page
function addBlogToPage(post) {
  if (!post || !post.category) {
    console.error("Invalid post object", post);
    return; //  return if the post object is invalid
  }

  const section =
    post.category === "tech"
      ? document.querySelector("#tech .blog-posts")
      : document.querySelector("#music .blog-posts");

  console.log("Section for post category", post.category, section);

  const postHTML = `
    <article>
      <img src="${post.image}" alt="${post.title}">
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="moreContent" style="display: none;">
        <p>${post.content}</p>
        <span>By ${post.author}</span>
        <span>${post.date}</span>
        <div class="comments-section">
          <h3>Comments</h3>
          <ul class="comments-list"></ul>
          <input type="text" class="comment-input" placeholder="Add a comment...">
          <button class="comment-btn" data-id="${post.id}">Post Comment</button>
        </div>
      </div>
      <a href="#" class="read-more">Read More</a>
    </article>
  `;
  section.insertAdjacentElement("afterbegin", postHTML); //add post to page
  setupReadMoreButtons();
  setupCommentFunctionality();
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
