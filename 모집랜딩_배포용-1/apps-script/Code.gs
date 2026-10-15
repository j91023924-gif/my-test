// 편지 신청 내용을 이 스프레드시트의 「신청」 시트에 한 줄씩 쌓습니다.
// 배포: 확장 프로그램 → Apps Script → 이 코드 붙여넣기 → 배포 → 새 배포 → 웹 앱
//       (실행 계정: 나, 액세스 권한: 모든 사용자) → 웹 앱 URL을 config.js의 SUBMIT_URL에 넣기
var COLS = ['ts', 'uid', 'g', 'src', 'store', 'nick', 'name', 'zip', 'addr', 'addr2', 'ref'];

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('신청') || ss.insertSheet('신청');
  if (sh.getLastRow() === 0) sh.appendRow(['신청시각', '회원ID', '소구', '경로', '매장', '닉네임', '받는 분', '우편번호', '주소', '상세 주소', '유입 URL']);
  sh.appendRow(COLS.map(function (k) {
    if (k === 'ts') return new Date(d.ts);
    if (k === 'zip' && d.zip) return "'" + d.zip; // 우편번호 앞자리 0 유지
    return d[k] || '';
  }));
  return ContentService.createTextOutput('ok');
}

// 테스트용: Apps Script 편집기에서 이 함수를 실행하면 시트에 한 줄 들어갑니다.
function test() {
  doPost({ postData: { contents: JSON.stringify({ ts: new Date().toISOString(), uid: 'test', g: '1', src: 'call', store: '패스카페', nick: '라떼좋아', name: '홍길동', zip: '06236', addr: '서울 강남구 테헤란로 1', addr2: '101호', ref: 'test' }) } });
}
