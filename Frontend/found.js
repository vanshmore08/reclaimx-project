let imageBase64 = "";

/* Category selection */
function selectCategory(el) {
  document.querySelectorAll(".cat-pill").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("category").value = el.innerText;
}

/* Image preview */
document.getElementById("photo").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    imageBase64 = reader.result;
    document.getElementById("preview").src = imageBase64;
    document.getElementById("preview-wrapper").style.display = "block";
  };
  reader.readAsDataURL(file);
});

function removeImage() {
  imageBase64 = "";
  document.getElementById("photo").value = "";
  document.getElementById("preview-wrapper").style.display = "none";
}

/* Submit Found Report */
function submitFound() {
  const report = {
    type: "found",
    name: document.getElementById("itemName").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    date: document.getElementById("dateFound").value,
    location: document.getElementById("location").value,
    fullName: document.getElementById("fullName").value,
    mobile: document.getElementById("mobile").value,
    photo: imageBase64
  };

  if (!report.name || !report.category || !report.fullName || !report.mobile) {
    alert("Please fill all required fields");
    return;
  }

  fetch("https://reclaimx-project.onrender.com/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  })
  .then(res => res.json())
  .then(() => {
    alert("Found item reported successfully!");
    window.location.href = "user-access.html";
  })
  .catch(err => {
    console.error(err);
    alert("Error submitting found report");
  });
}
