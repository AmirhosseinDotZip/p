async function loadBlogPosts() {
  try {
    // Simple marked configuration
    marked.use({
      breaks: true,
      gfm: true,
      mangle: false,
      headerIds: false,
    });

    console.log("Loading blog posts...");
    const baseURL =
      window.location.hostname === "amirhosseindotzip.github.io" ? "/p" : "";
    const response = await fetch(`./posts.json`); // Changed path to root
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Posts data:", data);

    const blogGrid = document.getElementById("blogPosts");
    blogGrid.innerHTML = ""; // Clear any existing content

    // Add a function to detect Persian text
    function hasPersian(text) {
      return /[\u0600-\u06FF]/.test(text);
    }

    for (const post of data.posts) {
      console.log("Loading post:", post.file);
      try {
        const response = await fetch(`./posts/${post.file}`); // Changed path to use posts directory
        if (!response.ok) {
          console.log(`Skipping ${post.file} - not found`);
          continue; // Skip this post and continue with next one
        }
        const content = await response.text();

        // Extract first two non-header paragraphs for preview
        const previewLines = content
          .split("\n")
          .filter(
            (line) =>
              line.trim() && !line.startsWith("#") && !line.startsWith("Tags:")
          )
          .slice(0, 2)
          .join("\n");

        const postElement = document.createElement("article");
        postElement.className = "blog-post";
        postElement.innerHTML = `
          <h2 ${hasPersian(post.title) ? 'lang="fa"' : ""}>${post.title}</h2>
          <div class="date">${post.date}</div>
          <div class="date">${post.datefa}</div>
          <div class="excerpt" ${
            hasPersian(previewLines) ? 'lang="fa"' : ""
          }>${previewLines}</div>
          <a href="${
            window.location.hostname === "amirhosseindotzip.github.io"
              ? "/p/post.html"
              : "./post.html"
          }?id=${post.id}" class="read-more">
            <button class="contactButton">
              Continue
              <div class="iconButton">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                </svg>
              </div>
            </button>
          </a>
        `;

        blogGrid.appendChild(postElement);
      } catch (postError) {
        console.log(`Error loading post ${post.file}:`, postError);
        continue; // Skip this post and continue with next one
      }
    }

    // Only show error if no posts were loaded
    if (blogGrid.children.length === 0) {
      blogGrid.innerHTML = "<p>No posts available.</p>";
    }
  } catch (error) {
    console.error("Error loading posts.json:", error);
    const blogGrid = document.getElementById("blogPosts");
    blogGrid.innerHTML =
      "<p>Error loading blog posts. Please try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);
