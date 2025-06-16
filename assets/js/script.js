// 1) 기존 로직 유지: localStorage → fetch → renderPosts
let posts = [];

function loadPosts() {
  const stored = localStorage.getItem("posts");
  if (stored) return Promise.resolve(JSON.parse(stored));
  return fetch("posts.json")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("posts", JSON.stringify(data));
      return data;
    });
}

loadPosts().then((data) => {
  posts = data;
  renderPosts(posts);
});

function renderPosts(postsArray) {
  const container = document.getElementById("post-list");
  container.innerHTML = "";
  postsArray.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const date = document.createElement("time");
    date.textContent = new Date(post.date).toLocaleDateString("ko-KR");

    const content = document.createElement("p");
    content.textContent = post.content;

    card.append(title, date, content);
    container.appendChild(card);
  });
}

// 2) 모달 열기/닫기 요소 선택
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = document.getElementById("close-modal-btn");
const modal = document.getElementById("modal");

// 3) 모달 열기: 클릭 시 .show 클래스 추가
openBtn.addEventListener("click", () => {
  modal.classList.add("show"); // classList.add → 모달 노출
});

// 4) 모달 닫기: 닫기 버튼 또는 오버레이 바깥 클릭
closeBtn.addEventListener("click", () => {
  modal.classList.remove("show"); // classList.remove → 모달 숨김
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    // 오버레이(배경) 클릭 감지
    modal.classList.remove("show");
  }
});

// 5) 폼 제출 처리: 새 글 추가
const form = document.getElementById("modal-form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // 폼 기본 리로드 방지

  // 5-1) 입력 값 가져오기
  const titleInput = document.getElementById("modal-title").value;
  const contentInput = document.getElementById("modal-content").value;
  const date = new Date().toISOString();

  // 5-2) 새 포스트 객체 생성
  const newPost = {
    title: titleInput,
    date,
    content: contentInput,
  };

  // 5-3) 배열 업데이트 + 저장
  posts.unshift(newPost); // unshift → 배열 앞에 삽입 (최신순)
  localStorage.setItem("posts", JSON.stringify(posts));

  // 5-4) UI 업데이트 & 모달 닫기
  renderPosts(posts);
  modal.classList.remove("show");
  form.reset(); // 폼 초기화
});
