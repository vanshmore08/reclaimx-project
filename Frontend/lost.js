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

/* Submit Lost Report */
function submitLost() {
  const report = {
    type: "lost",
    name: document.getElementById("itemName").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    date: document.getElementById("dateLost").value,
    location: document.getElementById("location").value,
    fullName: document.getElementById("fullName").value,
    mobile: document.getElementById("mobile").value,
    classCourse: document.getElementById("classCourse").value,
    photo: imageBase64
  };

  if (!report.name || !report.category || !report.fullName || !report.mobile) {
    alert("Please fill all required fields");
    return;
  }

  fetch("http://localhost:5000/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  })
  .then(res => res.json())
  .then(() => {
    alert("Lost item reported successfully!");
    window.location.href = "dashboard.html";
  })
  .catch(err => {
    console.error(err);
    alert("Error submitting lost report");
  });
}
