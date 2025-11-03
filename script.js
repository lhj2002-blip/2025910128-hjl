// script.js

window.onload = function () {
  const container = document.body;

  // 저울 이미지 추가
  const scale = document.createElement("img");
  scale.src = "images/scale.png";
  scale.id = "scale";
  container.appendChild(scale);

  // 팝업창 생성
  const popup = document.createElement("div");
  popup.id = "popup";
  popup.innerHTML = `
    <p id="popup-text"></p>
    <button id="close-popup">닫기</button>
  `;
  container.appendChild(popup);

  // 🟢 인포박스(hover용 정보창) 생성
  const infoBox = document.createElement("div");
  infoBox.id = "info-box";
  infoBox.style.position = "absolute";
  infoBox.style.background = "rgba(255,255,255,0.95)";
  infoBox.style.border = "2px solid #000";
  infoBox.style.borderRadius = "8px";
  infoBox.style.padding = "8px";
  infoBox.style.fontSize = "12px";
  infoBox.style.display = "none";
  infoBox.style.zIndex = "9999"; // 가장 위에 표시되도록 수정
  infoBox.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
  container.appendChild(infoBox);

  const leftPlate = { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 };
  const rightPlate = { x: window.innerWidth / 2 + 150, y: window.innerHeight / 2 };

  // 🧩 소품 불러오기
  propsData.forEach((p, i) => {
    const img = document.createElement("img");
    img.src = p.image;
    img.classList.add("prop");
    img.style.left = `${80 + (i % 10) * 100}px`;
    img.style.top = `${80 + Math.floor(i / 10) * 100}px`;
    img.style.position = "absolute";
    img.style.cursor = "grab";
    img.draggable = true;

    // 드래그 시 데이터 전송
    img.ondragstart = e => {
      e.dataTransfer.setData("text/plain", JSON.stringify(p));
    };

   // 🟡 마우스를 올렸을 때 infoBox 보이기
img.addEventListener("mousemove", e => {
  infoBox.style.display = "block";
  infoBox.style.left = e.pageX + 15 + "px";
  infoBox.style.top = e.pageY + 15 + "px";
  infoBox.innerHTML = `
    <strong>${p.name}</strong><br>
    <em>${p.movie}</em><br>
    💵 $${p.price.toLocaleString()}
  `;
});


    // 🟡 마우스를 떼면 infoBox 숨기기
    img.addEventListener("mouseleave", () => {
      infoBox.style.display = "none";
    });

    container.appendChild(img);
  });

  // 🧩 드롭 이벤트 등록
  container.ondragover = e => e.preventDefault();

  container.ondrop = e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const dropX = e.clientX;

    let side;
    if (dropX < window.innerWidth / 2) {
      side = "left";
    } else {
      side = "right";
    }

    handleDrop(data, side);
  };

  // 🧩 드롭 시 비교 로직
  let leftItem = null;
  let rightItem = null;

  function handleDrop(item, side) {
    if (side === "left") leftItem = item;
    else rightItem = item;

    if (leftItem && rightItem) {
      showPopup(leftItem, rightItem);
      leftItem = null;
      rightItem = null;
    }
  }

  // 🧩 팝업창 표시
  function showPopup(a, b) {
    const text = document.getElementById("popup-text");
    const winner = a.price > b.price ? a : b;
    const loser = a.price > b.price ? b : a;

    text.innerHTML = `
  <h3>${a.name} vs ${b.name}</h3>
  <p><b>더 비싼 소품:</b> ${winner.name}</p>
  <p>${winner.movie} (💵 $${winner.price.toLocaleString()})</p>
  <hr>
  <p>${loser.name}: 💵 $${loser.price.toLocaleString()}</p>
`;


    popup.style.display = "block";
    document.getElementById("close-popup").onclick = () => {
      popup.style.display = "none";
    };
  }
};
