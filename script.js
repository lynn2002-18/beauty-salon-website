document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // -------------------
  // 👇 index.html 页面交互逻辑
  // -------------------
  const skinTypeToCategoryMap = {
    "Dry": ["Hydration"],
    "Oily": ["Acne","Combo Treatment"],
    "Normal": ["Hydration","Combo Treatment"],
    "Sensitive": ["Hydration"],
    "Combo": ["Hydration","Anti-Aging"],
    "Not Sure": ["Hydration","Acne","Combo Treatment","Anti-Aging"],
  }
  if (path.includes("index.html")) {
    const optionCards = document.querySelectorAll(".option-card");
    const nextButton = document.querySelector(".next-button");
    let selectedType = null;

    optionCards.forEach(card => {
      card.addEventListener("click", () => {
        optionCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedType = card.dataset.type;
        nextButton.disabled = false;
        nextButton.classList.add("enabled");
      });
    });

    nextButton.addEventListener("click", () => {
      if (selectedType) {
    const mappedCategories = skinTypeToCategoryMap[selectedType];
    if (mappedCategories && mappedCategories.length > 0) {
      const queryParam = mappedCategories.map(c => encodeURIComponent(c)).join(",");
      window.location.href = `services.html?category=${queryParam}`;
    } else {
      alert("No matching category found.");
    }
  }

    });
  }

// -------------------
// 👇 services.html 页面：加载服务卡片
// -------------------
if (path.includes("services.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const targetTreatmentId = urlParams.get("treatment");
  const rawCategories = urlParams.get("category");
  const categoryNames = rawCategories ? rawCategories.split(",") : [];

  fetch("services.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("serviceCardsContainer");
      if (!container) return;

      // 👉 如果传了 treatmentId，只渲染单个卡片
      if (targetTreatmentId) {
        for (const category of data.categories) {
          const treatment = category.treatments.find(t => t.id === targetTreatmentId);
          if (treatment) {
            const card = document.createElement("div");
            card.classList.add("service-card", "active");
            card.id = treatment.id;

            const imagePath = `images/${treatment.id}.jpg`;
            card.innerHTML = `
              <img src="${imagePath}" alt="${treatment.title}" class="card-image" />
              <div class="card-content">
                <h3>${treatment.title}</h3>
                ${treatment.duration ? `<p><strong>Duration:</strong> ${treatment.duration}</p>` : ""}
                <p><strong>Price:</strong> 
                  <span class="price-highlight">${treatment.price}</span><br>
                  ${treatment.package ? `or <span class="price-highlight">${treatment.package}</span>` : ""}
                </p>
                ${treatment.package ? `<p class="best-value">✨ Best value! Save with 5 sessions ✨</p>` : ""}
                <p>${treatment.description}</p>
              </div>
            `;
            container.appendChild(card);
            break;
          }
        }
        return; // ✅ 显示完目标卡片后 return，阻止继续加载 category
      }

      // 👉 否则按 category 加载多个卡片（保持原逻辑）
      // 遍历每一个分类
      categoryNames.forEach(name => {
        const trimmedName = name.trim(); // 去掉空格
        const categoryObj = data.categories.find(cat => cat.name === trimmedName);
        if (!categoryObj) {
          console.warn(`⚠️ Category not found: ${trimmedName}`);
          return;
        }

        categoryObj.treatments.forEach(service => {
          const card = document.createElement("div");
          card.classList.add("service-card", "active");
          card.id = service.id;
          const imagePath = `images/${service.id}.jpg`;
card.innerHTML = `
  <img src="${imagePath}" alt="${service.title}" class="card-image" />
  <div class="card-content">
    <h3>${service.title}</h3>
    ${service.duration ? `<p><strong>Duration:</strong> ${service.duration}</p>` : ""}
    <p><strong>Price:</strong> 
      <span class="price-highlight">${service.price}</span><br>
      ${service.package ? `or <span class="price-highlight">${service.package}</span>` : ""}
    </p>
    ${service.package ? `<p class="best-value">✨ Best value! Save with 5 sessions ✨</p>` : ""}
    <p>${service.description}</p>
  </div>
`;
          container.appendChild(card);
        });
      });

      // 滚动到指定卡片（锚点跳转）
      if (treatmentIdFromHash) {
        const target = document.getElementById(treatmentIdFromHash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    })
    .catch(error => {
      console.error("Error loading services:", error);
    });
}

  // -------------------
  // 👇 index.html 页面：主页互动卡片按钮生成
  // -------------------
  if (path.endsWith("/") || path.includes("index.html")) {
    fetch("services.json")
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById("treatmentOptions");
        if (!container) return;

        data.categories.forEach(category => {
          category.treatments.forEach(treatment => {
            const button = document.createElement("button");
            button.textContent = treatment.title;
            button.onclick = () => {
            const treatmentId = treatment.id;
            window.location.href = `services.html?treatment=${treatmentId}`;
          };

          container.appendChild(button);

          });
        });
      });
  }
    // ✅ ✅ ✅  dropdown 下拉控制逻辑
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    const dropbtn = dropdown.querySelector('.dropbtn');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    dropbtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      if (dropdownContent) {
        dropdownContent.style.display = dropdown.classList.contains('open') ? 'block' : 'none';
      }
    });

    window.addEventListener('click', () => {
      dropdown.classList.remove('open');
      if (dropdownContent) {
        dropdownContent.style.display = 'none';
      }
    });

    dropdownContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }


});











