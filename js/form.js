const form = () => {
  const contactForm = document.querySelector(".contactForm"),
    responseMessage = document.querySelector(".response");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    responseMessage.classList.add("open");
    responseMessage.textContent = "Please wait...";

    async function getData() {
      try {
        const response = await fetch("mail.php", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          responseMessage.textContent = result;
        }

        const result = await response.text();
        responseMessage.textContent = result;
      } catch (error) {
        console.error(error.message);
      }
    }

    getData()
      .then(
        setTimeout(() => {
          responseMessage.classList.remove("open");
        }, 3000)
      )
      .finally(form.reset());
  });
};
export default form;
