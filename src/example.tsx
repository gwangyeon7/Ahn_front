const response = await fetch("http:localhost:18080/api/login", { //요청을 보내는 주소

  method: "POST",                                // 데이터를 생성하겠다

  headers: {"Content-Type": "application/json"}, //데이터 형식을 JSON으로 지정

  body: JSON.stringify({name: "안정연"})          // 실제로 보내는 데이터

});

const data = await response.json(); // (서버가 처리한) 응답을 받는곳

console.log(data) // { success: true, message: "생성완료" } // true로 받으면 성공 메세지가 생성됨