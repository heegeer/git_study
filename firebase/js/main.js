import { authService } from "./firebase.js";
import { handleLocation } from "./router.js";
import { handleAuth, onToggle } from "./pages/loginpage.js";
import { changeProfile, onFileChange } from "./pages/profile.js";

// hash url 변경 시 처리
window.addEventListener("hashchange", handleLocation);

// // 첫 랜딩 또는 새로고침 시 처리
// document.addEventListener("DOMContentLoaded", handleLocation);


document.addEventListener("DOMContentLoaded", () => {

     handleLocation();

     authService.onAuthStateChanged((user) => {
          if (user) {
               alert("로그인 상태")         
          } else {
               alert("로그아웃 상태")             
          }
          });
});

// 전역 함수 리스트
// window.route = route;
window.onToggle = onToggle;
window.handleAuth = handleAuth;
// window.goToProfile = goToProfile;
// window.socialLogin = socialLogin;
// window.logout = logout;
window.onFileChange = onFileChange;
window.changeProfile = changeProfile;

