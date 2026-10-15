// 여기만 바꾸면 됩니다. 화면 문구에 그대로 들어갑니다.
window.CONFIG = {
  SUBMIT_URL: 'https://script.google.com/macros/s/AKfycbxRMhXiCESeg-NJPvTQw9JU5O6-u5PjwKCoWeenIUM_xcvIZ-k6w9XD-Tb3Fy0c7kERBA/exec',                 // 신청 내용을 보낼 Apps Script 웹 앱 주소. 비우면 전송 없이 완료 화면만
  KAKAO_CHANNEL_URL: '',          // 문의 · 취소용 패스오더 카카오톡 채널 주소. 비우면 글자만 보임
  COUPON_BASE: '○○원',            // 편지를 건네면 받는 기본 쿠폰 금액 (예: '2,000원')
  COUPON_BASE_MIN: '○원',         // 기본 쿠폰 최소 주문 금액
  COUPON_BASE_UNTIL: '○월 ○일',   // 기본 쿠폰 사용 기한
  COUPON_BONUS_MIN: '○원',        // 10,000원 쿠폰 최소 주문 금액
  COUPON_BONUS_UNTIL: '○월 ○일',  // 10,000원 쿠폰 사용 기한
  SEND_DAYS: '영업일 ○일',         // 신청 후 편지를 우편으로 보내기까지
  PAY_DAYS: '○일'                  // 「편지 건넸어요」 후 쿠폰 지급까지
};
