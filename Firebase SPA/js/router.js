import { authService } from "./firebase.js";

const routes = {
  404: "/pages/404.html",
  "/": "/pages/auth.html",
  fanLog: "/pages/fanLog.html",
  profile: "/pages/profile.html",
};
import { getCommentList } from "./pages/fanLog.js";

// handleLocation = 화면을 띄워주는(바꾸는) 역할을 하는 함수!!
export const handleLocation = async () => {
  let path = window.location.hash.replace("#", "");
  const pathName = window.location.pathname;

  // Live Server를 index.html에서 오픈할 경우
  if (pathName === "/index.html") {
    window.history.pushState({}, "", "/");
  }
  if (path.length == 0) {
    path = "/";
  }

  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("root").innerHTML = html;

  // 현재 띄워진 화면에서만 DOM 조작 가능
  // 특정 화면 렌더링 되자마자 DOM 조작 처리
  // 꼭 handleLocation 안에서 if문으로 path(어떤 화면인지)를 선택해야 함
  if (path === "fanLog") {
    // 로그인한 회원의 프로필사진과 닉네임을 화면에 표시해줌.
    // console.log("authService.currentUser:", authService.currentUser);
    document.getElementById("nickname").textContent =
      // displayName 값이 없다면 "닉네임 없음" 띄우기
      // null 병합 연산자 구조
      // authService.currentUser.displayName 값이 null 또는 undefined라면 "닉네임 없음"을 띄우고
      // 아니라면 authService.currentUser.displayName 값을 그대로 출력해라
      authService.currentUser.displayName ?? "닉네임 없음";

    document.getElementById("profileImg").src =
      authService.currentUser.photoURL ?? "../assets/blankProfile.webp";

    // 댓글 리스트 불러오기
    getCommentList();
  }
  if (path === "profile") {


    // 프로필 관리 화면 일 때 현재 프로필 사진과 닉네임 할당
    document.getElementById("profileView").src =
      authService.currentUser.photoURL ?? "/assets/blankProfile.webp";
    document.getElementById("profileNickname").placeholder =
      authService.currentUser.displayName ?? "닉네임 없음";
  }
};

export const goToProfile = () => {
  window.location.hash = "#profile";
};
