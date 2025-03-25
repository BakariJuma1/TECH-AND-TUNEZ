//loading my content from the server
document.addEventListener("DOMContentLoaded", displayData);

//this function fetches data and also displays the content on the page
function displayData() {
  fetch("http://localhost:4000/posts")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        console.log(item); //TESTING TO SEE IF THE POSTS ARE FETCHED
      });
    });

  //accessing the home div and adding the content to it
  const home = document.getElementById("home");
  home.innerHTML = ` <img src="featured-image.jpg" alt="Featured Article" />
      <div class="featured-content">
        <h2>The Future of AI in Music</h2>
        <p>
          Discover how artificial intelligence is shaping the music industry.
        </p>
        <div class="moreContent">  
           <p> extra hidden content goes here</P>
         
        </div>
        <a href="#" class="read-more">Read More</a>
      </div>`;

  //creating an event listener for the read more button
  const readMore = document.querySelector(".read-more");
  readMore.addEventListener("click", (event) => {
    event.preventDefault();
    const MoreContent = document.querySelector(".moreContent");

    if (MoreContent.style.display === "none") {
      MoreContent.style.display = "block";
      readMore.textContent = "Read Less";
    } else {
      MoreContent.style.display = "none";
      readMore.textContent = "Read More";
    }
  });
}
