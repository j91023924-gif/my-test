// 편지 신청을 「신청」 시트에, 페이지 방문을 「방문」 시트에 한 줄씩 쌓습니다.
// 배포: 확장 프로그램 → Apps Script → 이 코드 붙여넣기 → 배포 → 새 배포 → 웹 앱
//       (실행 계정: 나, 액세스 권한: 모든 사용자) → 웹 앱 URL을 config.js의 SUBMIT_URL에 넣기
//
// 페이지가 보내는 요청 (type)
//   visit : 페이지를 열었을 때 → 「방문」에 한 줄 추가
//   step  : 신청 화면으로 넘어갔을 때 → 「방문」의 도달 단계 갱신
//   apply : 신청했을 때 (type 없는 예전 요청도 신청으로 처리) → 「신청」에 한 줄 추가 + 「방문」 갱신

var APPLY_HEAD = ['신청번호', '신청시각', '진입시각', '소요시간(초)', '회원ID', '소구', '경로', '매장', '표시 숫자', '첫 참여', '닉네임', '닉네임 변경', '받는 분', '우편번호', '주소', '상세 주소', '기기', '열린 앱', '유입 URL', '요일', '시간대', '중복 신청', '처리상태', '편지 발송일', '운송장번호', '사장님 문의 여부', '참여쿠폰 지급일', '성공쿠폰 지급일', '메모'];
var VISIT_HEAD = ['방문ID', '진입시각', '회원ID', '소구', '경로', '매장', '기기', '열린 앱', '도달 단계', '신청화면 진입시각', '신청시각', '유입 URL'];
var STEPS = ['랜딩', '신청화면', '신청완료'];

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (d.type === 'visit') addVisit(d);
    else if (d.type === 'step') updateVisit(d, '신청화면', 10);
    else { addApply(d); updateVisit(d, '신청완료', 11); }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

// 손님이 입력한 값은 글자로 고정한다 (우편번호 앞자리 0 유지, '='로 시작하는 값이 수식으로 바뀌지 않게)
function txt(v) { return v ? "'" + v : ''; }
function at(iso) { return iso ? new Date(iso) : ''; }

function sheet(name, head) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); }
  return sh;
}

function addApply(d) {
  var sh = sheet('신청', APPLY_HEAD);
  var r = sh.getLastRow() + 1;
  var B = 'B' + r, E = 'E' + r;
  sh.getRange(r, 1, 1, APPLY_HEAD.length).setValues([[
    txt(d.vid), at(d.ts), at(d.t0),
    '=IF(C' + r + '="","",ROUND((' + B + '-C' + r + ')*86400))',
    txt(d.uid), txt(d.g), txt(d.src), txt(d.store),
    d.n === undefined ? '' : d.n,
    d.first === undefined ? '' : (d.first ? 'Y' : 'N'),
    txt(d.nick),
    d.nickChanged === undefined ? '' : (d.nickChanged ? 'Y' : 'N'),
    txt(d.name), txt(d.zip), txt(d.addr), txt(d.addr2),
    txt(d.device), txt(d.app), txt(d.ref),
    '=TEXT(' + B + ',"ddd")',
    '=TEXT(' + B + ',"hh")&"시"',
    '=IF(' + E + '="","",IF(COUNTIF(E$2:' + E + ',' + E + ')>1,"중복",""))',
    '접수', '', '', '', '', '', ''
  ]]);
}

function addVisit(d) {
  var sh = sheet('방문', VISIT_HEAD);
  sh.getRange(sh.getLastRow() + 1, 1, 1, VISIT_HEAD.length).setValues([[
    txt(d.vid), at(d.ts), txt(d.uid), txt(d.g), txt(d.src), txt(d.store),
    txt(d.device), txt(d.app), '랜딩', '', '', txt(d.ref)
  ]]);
}

// 방문 행의 도달 단계를 올리고(내리지는 않음) 해당 시각을 적는다. 방문 기록이 없으면 새로 만든다.
function updateVisit(d, step, timeCol) {
  if (!d.vid) return;
  var sh = sheet('방문', VISIT_HEAD);
  var found = sh.getRange('A:A').createTextFinder(d.vid).matchEntireCell(true).findNext();
  if (!found) { addVisit(d); found = sh.getRange('A:A').createTextFinder(d.vid).matchEntireCell(true).findNext(); }
  var r = found.getRow();
  var cur = sh.getRange(r, 9).getValue();
  if (STEPS.indexOf(step) > STEPS.indexOf(cur)) sh.getRange(r, 9).setValue(step);
  sh.getRange(r, timeCol).setValue(at(d.ts));
}

// 테스트용: Apps Script 편집기에서 이 함수를 실행하면 「방문」과 「신청」에 한 줄씩 들어갑니다.
function test() {
  var now = new Date().toISOString();
  var base = { vid: 'TEST' + Date.now(), uid: 'test', g: '1', src: 'call', store: '패스카페', device: 'PC', app: '일반 브라우저', ref: 'test' };
  doPost({ postData: { contents: JSON.stringify(Object.assign({ type: 'visit', ts: now }, base)) } });
  doPost({ postData: { contents: JSON.stringify(Object.assign({ type: 'apply', ts: now, t0: now, n: 9, first: true, nick: '라떼좋아', nickChanged: false, name: '홍길동', zip: '06236', addr: '서울 강남구 테헤란로 1', addr2: '101호' }, base)) } });
}
