document.addEventListener("DOMContentLoaded", async () => {
  const box = document.getElementById("foundItemsList");

  const BACKEND_URL = "https://reclaimx-project.onrender.com/api";

  // User session check
  if (!sessionStorage.getItem("userLoggedIn")) {
    window.location.href = "user-access.html";
    return;
  }

  try {
    // Fetch all reports from backend
    const res = await fetch(`${BACKEND_URL}/reports`);
    const allReports = await res.json();

    // Filter only 'found' type items
    const foundItems = allReports.filter(
      r => r.type === "found" && !r.resolvedAt
    );

    if (foundItems.length === 0) {
      box.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:40px; color:#888;">
          No found items reported yet.
        </div>`;
      return;
    }

    // Display all found items
    box.innerHTML = foundItems.reverse().map(item => `
      <div class="item-card modern-item-card">
        <span class="badge badge-found">FOUND</span>

        ${item.photo
          ? `<img src="${item.photo}" class="item-img" style="cursor:zoom-in;" onclick="openModal('${item.photo}')">`
          : `<div class="no-img" style="height:150px; display:flex; align-items:center; justify-content:center; background:#eee;">No Image</div>`}

        <div class="item-details">
          <h3>${item.name}</h3>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Location:</strong> ${item.location || "N/A"}</p>
          <p><strong>Date:</strong> ${item.date || "N/A"}</p>
          <p class="item-desc">"${item.description || ""}"</p>
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    box.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:red;">Failed to load data from server.</div>`;
  }
});

/* Image modal popup */
function openModal(src) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    display:flex; justify-content:center; align-items:center;
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.9); z-index:2000;
  `;
  const img = document.createElement("img");
  img.src = src;
  img.style.cssText = "max-width:90%; max-height:80%; border-radius:10px; border:3px solid white;";
  const closeBtn = document.createElement("span");
  closeBtn.innerText = "×";
  closeBtn.style.cssText = "position:absolute; top:20px; right:30px; color:white; font-size:40px; cursor:pointer;";
  closeBtn.onclick = () => document.body.removeChild(modal);
  modal.appendChild(img);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);
}
