import { handleAuth, onToggle, logout, socialLogin } from "./pages/auth.js";
import { changeProfile, onFileChange } from "./pages/profile.js";
import { handleLocation, goToProfile } from "./router.js";
import { authService } from "./firebase.js";
import {
  save_comment,
  update_comment,
  onEditing,
  delete_comment,
} from "./pages/fanLog.js";

// hash 값(url)이 바뀌면 handleLocation 함수 실행하여 화면 변경
window.addEventListener("hashchange", handleLocation);

// 처음에 랜더링 또는 새로고침 했을 때 DOMContentLoaded라는 이벤트가 발생함
// html, css, js 파일을 정상적으로 다운 받았다면 handleLocation 함수를 실행해서 화면 변경
document.addEventListener("DOMContentLoaded", function () {
  // 유저 정보가 담긴 객체 authService에 onAuthStateChanged라는 이벤트리스너를 달았음
  // Firebase 연결상태를 감시-로그인 상태인지 로그아웃 상태인지
  // user === authService.currentUser 와 같은 값
  authService.onAuthStateChanged((user) => {
    // Firebase 연결되면 현재 url에 해당하는 화면을 띄우는 역할
    // 웹페이지 화면이 보인다는 것은 firebase가 연결되었다는 의미!
    handleLocation();
    // hash 값은 '어떤' 화면을 보일 것인지를 의미함
    const hash = window.location.hash;
    // user라는 객체가 존재한다는 것은 로그인이 되었다는 의미
    if (user) {
      // 로그인 상태이므로 항상 팬명록 화면으로 이동
      // 로그인 상태에서는 로그인 화면으로 되돌아갈 수 없게 설정
      if (hash === "") {
        window.location.replace("#fanLog");
      }
    } else {
      // user 객체가 null 값을 뱉었다면(유저 정보가 없다면)
      // 로그아웃 상태이므로 로그인 화면으로 강제 이동
      if (hash !== "") {
        window.location.replace("");
      }
    }
  });
});

// type="module"로 설정했기 때문에 전역적인 접근이 불가능함
// window는 전역 객체-어디서든 접근 가능
// window를 이용해서 상단에서 import한 함수들을 전역적으로 할당하는 것
// onclick, onchange, onsubmit 버튼 이벤트 핸들러 리스트
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.goToProfile = goToProfile;
window.socialLogin = socialLogin;
window.logout = logout;
window.onFileChange = onFileChange;
window.changeProfile = changeProfile;
window.save_comment = save_comment;
window.update_comment = update_comment;
window.onEditing = onEditing;
window.delete_comment = delete_comment;
