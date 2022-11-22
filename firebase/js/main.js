import { authService } from "./firebase.js";
import { handleLocation } from "./router.js";
import { handleAuth, onToggle } from "./pages/loginpage.js";
import { changeProfileImage, changeProfileNickname, onFileChange, nicknameBtn } from "./pages/profile.js";
// import Swal from 'sweetalert2'
// import { changeProfile, onFileChange, nicknameBtn } from "./pages/profile.js";

// hash url 변경 시 처리
window.addEventListener("hashchange", handleLocation);

// // 첫 랜딩 또는 새로고침 시 처리
// document.addEventListener("DOMContentLoaded", handleLocation);

document.addEventListener("DOMContentLoaded", () => {
     handleLocation();
   
     authService.onAuthStateChanged((user) => {
       
          if (user) {
     //     alert("로그인 상태");

         // 이미지, 닉네임 변경 시 업데이트 해주는 역할
         document.getElementById("profileView").src =
           user.auth.currentUser.photoURL || "/assets/blankProfile.webp";
         document.getElementById("profileNickname_val").textContent =
           user.auth.currentUser.displayName || "닉네임 없음";
         document.getElementById("profileEmail").textContent =
           user.email ?? "이메일 없음";  

     //    window.location.reload(); 
           

       } else {
     //     alert("로그아웃 상태");
         Swal.fire('로그아웃 상태입니다')
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
window.changeProfileImage = changeProfileImage;
window.changeProfileNickname = changeProfileNickname;
// window.changeProfile = changeProfile;
window.nicknameBtn = nicknameBtn;
// window.Swal = Swal;

