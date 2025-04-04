async function loadBlogPosts() {
  try {
    console.log("Loading blog posts...");
    const response = await fetch("/blog/posts.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Posts data:", data);

    const blogGrid = document.getElementById("blogPosts");

    for (const post of data.posts) {
      console.log("Loading post:", post.file);
      const response = await fetch(`/blog/${post.file}`);
      if (!response.ok) {
        throw new Error(`Could not load post ${post.file}`);
      }
      const content = await response.text();
      const excerpt = content.split("\n").slice(0, 3).join("\n");

      const postElement = document.createElement("article");
      postElement.className = "blog-post";
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <div class="date">${post.date}</div>
        <div class="excerpt">${marked.parse(excerpt)}</div>
        <a href="/blog/post.html?id=${post.id}" class="read-more">Read more</a>
      `;

      blogGrid.appendChild(postElement);
    }
  } catch (error) {
    console.error("Error loading blog posts:", error);
    const blogGrid = document.getElementById("blogPosts");
    blogGrid.innerHTML =
      "<p>Error loading blog posts. Please try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogPosts);
