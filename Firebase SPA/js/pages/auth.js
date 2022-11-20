import { emailRegex, pwRegex } from "../util.js";
import { authService } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,signInWith,
  GithubAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// 로그인 성공 시 팬명록 화면으로 이동
// handleAuth가 로그인, 회원가입 버튼 두 개의 기능을 수행함
export const handleAuth = (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const emailVal = email.value;
  const pw = document.getElementById("pw");
  const pwVal = pw.value;

  // 유효성 검사 진행
  if (!emailVal) {
    alert("이메일을 입력해 주세요");
    // focus() - 해당 요소에 포커스를 부여하여
    //텍스트 창의 경우, 커서를 위치시켜 바로 입력이 가능함
    email.focus();
    return;
  }
  if (!pwVal) {
    alert("비밀번호를 입력해 주세요");
    pw.focus();
    return;
  }

  // match() 메서드는 문자열이 정규식과 매치되는 부분을 검사해서 이를 반환함
  // 정규식 = 정규표현식 = Regex
  // emailRegex, pwRegex 규칙과 일치하다면 값을 저장함
  const matchedEmail = emailVal.match(emailRegex);
  const matchedPw = pwVal.match(pwRegex);

  // 정규식과 일치하지 않을 때 null 값을 넣고 alert를 띄움
  if (matchedEmail === null) {
    alert("이메일 형식에 맞게 입력해 주세요");
    email.focus();
    // 다음 페이지로 넘어가지 않게 return으로 끊어주기!
    return;
  }
  if (matchedPw === null) {
    alert("비밀번호는 8자리 이상 영문자, 숫자, 특수문자 조합이어야 합니다.");
    pw.focus();
    return;
  }

  // 유효성 검사 통과 후 로그인 또는 회원가입 API 요청
  const authBtnText = document.querySelector("#authBtn").value;
  if (authBtnText === "로그인") {
    // 유효성검사 후 로그인 성공 시 팬명록 화면으로
    // 상단에 import한 firebase-auth API로 서비스 연결하고 이메일, 패스워드 넣어 줌
    signInWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        // Signed in 로그인 버튼 클릭의 경우
        const user = userCredential.user;
        window.location.hash = "#fanLog";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("user-not-found")) {
          alert("가입되지 않은 회원입니다.");
          return;
        } else if (errorMessage.includes("wrong-password")) {
          alert("비밀번호가 잘못 되었습니다.");
        }
      });
  } else {
    // 회원가입 버튼 클릭의 경우
    createUserWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        // Signed in
        console.log("회원가입 성공!");
        // const user = userCredential.user;
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("email-already-in-use")) {
          alert("이미 가입된 이메일입니다.");
        }
      });
  }
};

// 로그인, 회원가입 화면 토글링 기능
export const onToggle = () => {
  const authBtn = document.querySelector("#authBtn");
  const authToggle = document.querySelector("#authToggle");
  const authTitle = document.querySelector("#authTitle");
  if (authBtn.value === "로그인") {
    authBtn.value = "회원가입";
    authToggle.textContent = "로그인 화면으로";
    authTitle.textContent = "회원가입 페이지";
  } else {
    authBtn.value = "로그인";
    authToggle.textContent = "회원가입 화면으로";
    authTitle.textContent = "로그인 페이지";
  }
};

// 소셜 로그인 API (ex. 구글)
export const socialLogin = (event) => {
  const { name } = event.target;
  let provider;
  if (name === "google") {
    provider = new GoogleAuthProvider();
  } else if (name === "github") {
    provider = new GithubAuthProvider();
  }
  signInWithPopup(authService, provider)
    .then((result) => {
      const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      console.log("error:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

// 로그아웃 API
export const logout = () => {
  signOut(authService)
    .then(() => {
      // Sign-out successful.
      localStorage.clear();
      console.log("로그아웃 성공");
    })
    .catch((error) => {
      // An error happened.
      console.log("error:", error);
    });
};
