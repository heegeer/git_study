import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";

// CRUD > Create
export const save_comment = async (event) => {
  event.preventDefault();
  // textarea 태그에 연결된 id 값이 "comment"
  const comment = document.getElementById("comment");
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    // addDoc(DB에 저장) API 이용해서 "comments" collection에 
    // 다섯 개의 속성(text, nickname...)을 가진 객채를 하나의 Document로 신규 등록함
    await addDoc(collection(dbService, "comments"), {
      text: comment.value,
      createdAt: Date.now(),
      // 유저 본인의 게시물에만 수정, 삭제 버튼을 나타내기 위해서 uid 값이 필요함
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
    });
    comment.value = "";
    // 댓글을 등록하면 기존 코멘트리스트를 지우고 댓글이 추가된 코멘트리스트를 업데이트함
    getCommentList();
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll(".editBtn, .deleteBtn");
  udBtns.forEach((udBtn) => (udBtn.disabled = "true"));

  const cardBody = event.target.parentNode.parentNode;
  const commentText = cardBody.children[0].children[0];
  const commentInputP = cardBody.children[0].children[1];

  commentText.classList.add("noDisplay");
  commentInputP.classList.add("d-flex");
  commentInputP.classList.remove("noDisplay");
  commentInputP.children[0].focus();
};

// CRUD > Update
export const update_comment = async (event) => {
  event.preventDefault();
  // event.target은 수정 버튼
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const parentNode = event.target.parentNode.parentNode;
  const commentText = parentNode.children[0];
  // 수정 버튼 눌렀을 때 상단에 뜨는 텍스트 입력창 안 보이게 설정
  commentText.classList.remove("noDisplay");
  const commentInputP = parentNode.children[1];
  commentInputP.classList.remove("d-flex");
  commentInputP.classList.add("noDisplay");
  
  // Ref는 파일의 위치라고 생각하기
  // firestore에 "comments" collection 내에서 해당 id값을 가진 doc을 찾아서 doc.text를 업데이트
  const commentRef = doc(dbService, "comments", id);
  try {
    // 해당 다큐먼트에서 text 값을 newComment로 바꿔달라고 요청함
    // await로 인해 text 값이 newComment로 바뀌고 나서 다음 코드로 진행됨
    await updateDoc(commentRef, { text: newComment });
    // DB 변경하고 다시 불러 옴
    getCommentList();
  } catch (error) {
    alert(error);
  }
};

// CRUD > Delete
export const delete_comment = async (event) => {
  // 버튼 누를 때 기본값인 새로고침 막기
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("해당 응원글을 정말 삭제하시겠습니까?");
  if (ok) {
    try {
      // firestore에 "comments" collection 내에서 해당 id값을 가진 doc을 찾아서 삭제
      await deleteDoc(doc(dbService, "comments", id));
      getCommentList();
    } catch (error) {
      alert(error);
    }
  }
};

// CRUD > Read
export const getCommentList = async () => {
  let cmtObjList = [];
  // query -> 원하는 조건으로(정렬 방식 혹은 필터링) 데이터를 가져올 수 있음
  const q = query(
    // firestore에 "comments" collection 안에서 데이터 불러올 때 
    // doc 객체 내에 createdAt 값을 내림차순(descending)으로 가져오는 쿼리 정의
    collection(dbService, "comments"),
    orderBy("createdAt", "desc")
  );

  // getDocs가 다큐먼트 리스트를 모두 불러 옴
  // getDocs의 파라미터로 q를 넣으면
  // querySnapshot라는 배열을 response로 뱉음
  // query 조건에 맞는 documents 데이터를 배열로 받아오기
  const querySnapshot = await getDocs(q);
  // console.log("querySnapshot:", querySnapshot)
  // doc.id는 DB가 자체적으로 생성하는 값으로, id도 함께 포함시키기 위해 객체 재구성
  querySnapshot.forEach((doc) => {
    const commentObj = {
      id: doc.id,
      ...doc.data(),
    };
    // firestore의 데이터를 cmtObjList라는 배열에 담는다
    cmtObjList.push(commentObj);
  });

  // "comment-list"라는 id 값을 가진 div에 삽입함
  const commnetList = document.getElementById("comment-list");
  const currentUid = authService.currentUser.uid;
  // 우선 빈문자열을 담아서 모든 코멘트 목록을 초기화한 다음에 하나씩 추가할 예정
  commnetList.innerHTML = "";
  // forEach 함수를 이용해서 배열 안의 데이터를 하나씩 순회함 (반복문 느낌?)
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <blockquote class="blockquote mb-0">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${
                    cmtObj.id
                  }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
                  <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${
                    cmtObj.profileImg
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? "닉네임 없음"
    }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
      .toString()
      .slice(0, 25)}</div></footer>
              </blockquote>
              <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                   <button onclick="onEditing(event)" class="editBtn btn btn-dark">수정</button>
                <button name="${
                  cmtObj.id
                }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
              </div>            
            </div>
     </div>`;
     // div 엘리먼트를 새로 만들어서 appendChild 배열을 하나씩 추가함
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });
};
