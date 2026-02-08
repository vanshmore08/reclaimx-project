let currentFilter = 'lost'; 
let isHistoryMode = false;

document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "index.html";
        return;
    }
    loadDashboard();
});

/* Toggle Pending / History */
function toggleHistory() {
    isHistoryMode = !isHistoryMode;

    document.getElementById("activeSection").style.display = isHistoryMode ? "none" : "block";
    document.getElementById("historySection").style.display = isHistoryMode ? "block" : "none";
    document.getElementById("lostTabBtn").style.display = isHistoryMode ? "none" : "block";
    document.getElementById("foundTabBtn").style.display = isHistoryMode ? "none" : "block";
    document.getElementById("resolvedTabBtn").style.display = isHistoryMode ? "block" : "none";

    const btn = document.getElementById("histBtn");
    btn.classList.toggle("history-active", isHistoryMode);

    if (isHistoryMode) {
        btn.innerText = "Back to Pending";
    } else {
        btn.innerHTML = `History (<span id="historyCount">${document.getElementById("historyCountDisplay").innerText}</span>)`;
    }

    loadDashboard();
}

/* Filter Lost / Found */
function filterItems(type) {
    currentFilter = type;
    const title = document.getElementById("sectionTitle");
    title.innerText = type === 'lost' ? "PENDING LOST REPORTS" : "PENDING FOUND REPORTS";
    title.style.color = type === 'lost' ? "#ff4b2b" : "#2ecc71";
    loadDashboard();
}

/* Load Dashboard */
async function loadDashboard() {
    const activeList = document.getElementById("adminReportsList");
    const historyList = document.getElementById("historyList");

    const searchInput = document.getElementById("adminSearch");
    const categoryInput = document.getElementById("categoryFilter");

    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const cat = categoryInput ? categoryInput.value : "";

    try {
        const res = await fetch("https://reclaimx-project.onrender.com/api/reports");
        const reports = await res.json();

        const pending = reports.filter(r => !r.resolvedAt);
        const resolved = reports.filter(r => r.resolvedAt);

        document.getElementById("lostCount").innerText =
            pending.filter(r => r.type === "lost").length;

        document.getElementById("foundCount").innerText =
            pending.filter(r => r.type === "found").length;

        document.getElementById("historyCountDisplay").innerText = resolved.length;

        if (!isHistoryMode) {
            const list = pending.filter(r =>
                r.type === currentFilter &&
                (r.name.toLowerCase().includes(search) ||
                    (r.fullName && r.fullName.toLowerCase().includes(search))) &&
                (cat === "" || r.category === cat)
            );

            activeList.innerHTML = list.length === 0
                ? `<p style="grid-column:1/-1;text-align:center;color:#888;">No reports found</p>`
                : list.reverse().map(renderPendingCard).join("");

        } else {
            const filteredHistory = resolved.filter(r =>
                r.name.toLowerCase().includes(search) ||
                (r.fullName && r.fullName.toLowerCase().includes(search))
            );

            historyList.innerHTML = filteredHistory.length === 0
                ? `<p style="grid-column:1/-1;text-align:center;color:#888;">No history records</p>`
                : filteredHistory.reverse().map(h => `
                    <div class="item-card modern-item-card" style="border-left:5px solid #2ecc71;">
                        <p style="font-size:11px;color:#2ecc71;font-weight:bold;">
                            RESOLVED ${h.type.toUpperCase()}
                        </p>
                        <h3>${h.name}</h3>
                        <p>Reporter: ${h.fullName || "N/A"}</p>
                        <p style="font-size:12px;color:#999;">${h.resolvedAt}</p>
                        <button onclick="deleteReport('${h._id}')"
                            style="margin-top:10px;background:#ff4b2b;color:white;border:none;
                            padding:8px;border-radius:8px;">
                            Delete 🗑️
                        </button>
                    </div>
                `).join("");
        }
    } catch (err) {
        console.error("Dashboard error:", err);
        alert("Failed to load dashboard");
    }
}

/* Pending Card */
function renderPendingCard(item) {
    return `
    <div class="item-card modern-item-card">
        <span class="badge ${item.type === "lost" ? "badge-lost" : "badge-found"}">
            ${item.type.toUpperCase()}
        </span>

        ${item.photo
            ? `<img src="${item.photo}" class="item-img" onclick="openModal('${item.photo}')">`
            : `<div class="no-img">No Image</div>`}

        <h3>${item.name}</h3>
        <p>${item.fullName || "Unknown"} | ${item.mobile || "N/A"}</p>

        <div style="display:flex;gap:8px;margin-top:10px;">
            <button onclick="resolveReport('${item._id}')" style="flex:2;background:#2ecc71;color:white;">
                Resolve
            </button>
            <button onclick="deleteReport('${item._id}')" style="flex:1;background:#ff4b2b;color:white;">
                🗑️
            </button>
        </div>
    </div>`;
}

/* Resolve */
async function resolveReport(id) {
    try {
        const res = await fetch(`https://reclaimx-project.onrender.com/api/reports/${id}/resolve`, { method: "PATCH" });
        if (res.ok) loadDashboard();
        else alert("Resolve failed");
    } catch {
        alert("Server error");
    }
}

/* Delete */
async function deleteReport(id) {
    if (!confirm("Delete this report?")) return;
    try {
        const res = await fetch(`https://reclaimx-project.onrender.com/api/reports/${id}`, { method: "DELETE" });
        if (res.ok) loadDashboard();
        else alert("Delete failed");
    } catch {
        alert("Server error");
    }
}

/* Export to CSV */
async function exportToExcel() {
    try {
        const res = await fetch("https://reclaimx-project.onrender.com/api/reports");
        const reports = await res.json();

        let csv = "Type,Item,Reporter,Mobile,Category,Status\n";

        reports.forEach(r => {
            csv += `${r.type},${r.name},${r.fullName || ""},${r.mobile || ""},${r.category},${r.resolvedAt ? "Resolved" : "Pending"}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "reclaimx-reports.csv";
        a.click();
    } catch {
        alert("Export failed");
    }
}

/* Modal */
function openModal(src) {
    document.getElementById("modalImg").src = src;
    document.getElementById("photoModal").style.display = "flex";
}
function closeModal() {
    document.getElementById("photoModal").style.display = "none";
}

/* Logout */
function confirmLogout() {
    if (confirm("Logout?")) {
        sessionStorage.removeItem("adminLoggedIn");
        window.location.href = "index.html";
    }
}
