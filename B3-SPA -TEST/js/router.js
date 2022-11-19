const route = (event) => {
     event.preventDefault();
     // event.target의 hash 값을 window.location.hash 값에 넣어라
     // event.target은 <body>의 a태그, 따라서 event.target의 hash 값은 #about이 됨
     // window.location.hash에 #about라는 값을 넣었음
     window.location.hash = event.target.hash;
   };
   
   const routes = {
     404: "/pages/404.html",
     "/": "/pages/mainpage.html",
     loginpage: "/pages/loginpage.html",
     mycontent: "/pages/mycontent.html",
     mypage: "/pages/mypage.html",
     writepage: "/pages/writepage.html",
   };
   
   // handleLocation = 화면을 띄워주는(바꾸는) 역할을 하는 함수!!
   // routes에서 맞는 값을 찾아서 main-page에 통째로 삽입함
   const handleLocation = async () => {
     // hash 값에서 #을 빈 문자열로 만든다 ex) #about -> about
     // 결론적으로 about라는 값이 path에 들어감
     let path = window.location.hash.replace("#", ""); 
   
     // "http://example.com/"가 아니라 도메인 뒤에 / 없이 "http://example.com" 으로 나오는 경우
     if (path.length == 0) {
       path = "/";
     }
     // route 변수에 routes[about]의 값, 즉 "/pages/about.html"라는 문자열이 담긴다
     // 이것이 html 파일의 위치를 '문자열로서' 알려주는 역할을 함
     const route = routes[path] || routes[404];
     // fetch(route).then((data) -> fetch API를 통해서 html '파일'을 알려준 위치에서 response 형태로 불러 옴
     // (response객체는 서버가 클라이언트의 요청에 응답하는 정보를 담고 있는 객체이다._
     // data.text() -> response 형태로 불러 온 파일을 text 메서드를 이용해서 string 값으로 바꿔 줌
     // 결과적으로 변수 html은 about.html을 담고 있는 string 값(문자열)이 됨
     const html = await fetch(route).then((data) => data.text());
   
     // html(문자열)을 main-page에 삽입함
     // temp_html 이용해서 문자열 삽입하는 방식과 동일함
     document.getElementById("main-page").innerHTML = html;
   };
   
   // hash 값이 바뀌면 handleLocation 함수를 실행함
   window.addEventListener("hashchange", handleLocation);
   
   // 처음에 랜더링 또는 새로고침 했을 때 DOMContentLoaded라는 이벤트가 발생함
   // html, css, js 파일을 정상적으로 다운 받았다면 handleLocation 함수를 실행함
   document.addEventListener("DOMContentLoaded", handleLocation);