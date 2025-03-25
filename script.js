document.addEventListener("DOMContentLoaded", displayData);

function displayData() {
  fetch("http://localhost:4000/posts")
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        const post = data[0]; // use the first post

        // Log each post for testing
        data.forEach((item) => {
          console.log(item);
        });

        // Access the home div and update the content using fetched data
        const home = document.getElementById("home");
        home.innerHTML = `
          <img src="featured-image.jpg" alt="Featured Article" />
          <div class="featured-content">
            <h2>${post.title}</h2>
            <p>${post.excerpt}</p>
            <div class="moreContent" >  
               <p>${post.content}</p>
               <img>${post.image}</img>
               <span>${post.author}</span>
               <span>${post.date}</span>
            </div>
            <a href="#" class="read-more">Read More</a>
          </div>
        `;

        // Create an event listener for the read more button
        const readMoreButtons = document.querySelectorAll(".read-more");
        readMoreButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            event.preventDefault();
            const moreContent = button.previousElementSibling; // Assuming .moreContent is right before the button

            if (
              moreContent.style.display === "none" ||
              moreContent.style.display === ""
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
    });

  //nav bar responsive for small screens
  const menu = document.getElementById("menu-toggle");
  const nav = document.querySelectorAll(".nav-left, .nav-center ,nav-right");
  console.log(nav, menu);
  menu.addEventListener("click", function () {
    nav.classList.toggle("show");
  });

  //submitting form
  const contactUs = document.getElementById("contact");
  contactUs.addEventListener("submit", submitInfo);

  function submitInfo() {
    event.preventDefault();
    console.log("am clicked");
  }
}
