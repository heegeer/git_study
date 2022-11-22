import { authService, storageService } from "../firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// 프로필 변경 버튼을 누르면 changeProfile라는 함수가 실행됨
export const changeProfile = async (event) => {
  event.preventDefault();
  // .disabled로 profileBtn 한 번만 클릭할 수 있도록 함 (한 번 클릭하면 비활성화됨)

  document.getElementById("profileBtn").disabled = true;
  const imgRef = ref(
    storageService,
    // Storage에서 이미지 저장 위치 지정.
    // 현 코드에서는 userId 폴더 내에 파일명은 uuid(전세계 유일한 ID)로 설정
    // 스토리지 안에 현재 유저 아이디(uid)로 폴더를 만들고 
    // 그 안에 uuidv4라는 hash 값으로 파일을 저장함
    // uuid -> 전세계적으로 겹치지 않는 아이디를 만들어 냄
    `${authService.currentUser.uid}/${uuidv4()}`
  );

  const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if (imgDataUrl) {
    // 파일 저장 API. 파일 포맷이 data_url인 경우
    // response는 정상적으로 스토리지에 업로드되었다는 의미
    // imgRef -> 스토리지 어디에 저장되어 있는지 위치를 담고 있음
    // imgDataUrl은 이미지 업로드하기 위한 임시적인 값
    const response = await uploadString(imgRef, imgDataUrl, "data_url");
    // 최종적으로 downloadUrl이 업로드한 프로필 이미지의 영구적 url이 되는 것
    // 앞으로 화면에 프로필 이미지를 출력할 때 downloadUrl을 이용 할 것임
    downloadUrl = await getDownloadURL(response.ref);
  }

  //프로필 이미지 변경 API
  // 현재 사용자 객체에서 displayName과 photoURL 변경
  await updateProfile(authService.currentUser, {
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "#profile";
      // window.location.reload();
    })
    .catch((error) => {
      alert("프로필 수정 실패");
      console.log("error:", error);
    });
};

// 마이페이지의 프로필 이미지를 클릭해서 업로드할 이미지 파일을 선택하고 
// '열기'를 눌렀을 때 onFileChange 함수가 실행됨
export const onFileChange = (event) => {
  // console.log("event.target:", event.target);
  const theFile = event.target.files[0]; // file 객체를 theFile라는 변수에 담았음
  // FileReader는 JS가 자체적으로 제공하는 API
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  // FileReader가 파일객체를 data URL로 변환 작업을 끝냈을 때
  // finishedEvent 이벤트가 발생해서 result 값을 imgDataUrl에 담음
  reader.onloadend = (finishedEvent) => {
    const imgDataUrl = finishedEvent.currentTarget.result;
    // 이미지를 업로드만 하고 업로드 버튼을 누르지 않았을 때는 스토리지에 저장하지 않기 위해
    // localStorage에 imgDataUrl을 임시로 보관함
    localStorage.setItem("imgDataUrl", imgDataUrl);
    document.getElementById("profileView").src = imgDataUrl;
  };
};

// let nicknameBtn = document.querySelector('.c1');

// c1.addEventListener('click', function() {
//   c1.classList.toggle('flipped');
// });

// 닉네임 버튼 클릭했을 때 input 창 띄우기 토글
// let btn = document.getElementById('profileNickname_val');
//       function change(){
//           if(btn.value=="black"){
//               btn.value= "white";
//               document.querySelector('body').style.backgroundColor='black';
//           }else{
//           btn.value="black";
//           document.querySelector('body').style.backgroundColor='white';
      
//       }
//       }

// 닉네임 버튼 클릭했을 때 input 창 띄우기 토글
// function nicknameBtn() {
export const nicknameBtn = () => {

  // 토글 할 버튼 선택 (btn1)
  const nameVal = document.getElementById('profileNickname_val');
  const nameInput = document.getElementById('profileNickname');
  
  // btn1 숨기기 (display: none)
  if(nameVal.style.display == 'block') {
    nameVal.style.display = 'none';
    nameInput.style.display = 'block';
  } else {
    nameVal.style.display = 'block';
    nameInput.style.display = 'none';
  };
  
};