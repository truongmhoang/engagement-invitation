window.WEDDING_CONFIG = {
  /* =========================================================
     1. TRANG MỞ THIỆP
     ========================================================= */
  openingTitle: "ENGAGEMENT INVITATION",
  groom: "Truong Manh Hoang",
  bride: "Lương Thuý Linh",
  dateText: "25 • 10 • 2026",

  /* Tên hiển thị bên trong thiệp (ngắn hơn để giống MAUTRANG) */
  groomDisplay: "Truong Hoang",
  brideDisplay: "Thuý Linh",
  groomSignature: "Truong",
  brideSignature: "Thuý Linh",
  groomRole: "Út Nam",
  brideRole: "Út Nữ",

  /* =========================================================
     2. NGÀY GIỜ
     ========================================================= */
  weddingDate: "2026-10-25T09:00:00",
  ceremonyTimeShort: "9:00 AM",
  heroTimeShort: "12:00 PM",
  ceremonyTimeLong: "Lúc 09 giờ 00 phút",
  weekday: "CHỦ NHẬT",
  weekdayTitle: "Chủ Nhật",
  day: "25",
  monthText: "THÁNG 10",
  monthShort: "Tháng 10",
  year: "2026",
  eventDate: "25.10.2026",
  lunarDate: "(Nhằm ngày 16 tháng 09 năm Bính Ngọ)",

  /* =========================================================
     3. GIA ĐÌNH
     ========================================================= */
  groomFather: "Ông: HOÀNG THẾ PHIỆT",
  groomMother: "Bà: BÙI THỊ LÀ",
  groomAddress: "TP Hồ Chí Minh",

  brideFather: "Ông: LƯƠNG SUM",
  brideMother: "Bà: HUỲNH THỊ MUỐI",
  brideAddress: "TP Hồ Chí Minh",

  /* =========================================================
     4. THIỆP MỜI / ĐỊA ĐIỂM
     ========================================================= */
  ceremonyTitle: "LỄ ĐÍNH HÔN",
  ceremonyHomeNote: "Lễ đính hôn diễn ra tại tư gia.",
  eventCardTitle: "TIỆC ĐÍNH HÔN",
  eventHall: "Sảnh: Felix Hall",
  venueShort: "White Palace",
  venueName: "WHITE PALACE VÕ VĂN KIỆT",
  eventTimeShort: "12:00 PM",
  venueAddress: "59 Đường Võ Văn Kiệt, Phường An Lạc, TP.HCM",

  /* Link mở Google Maps */
  mapUrl: "https://www.google.com/maps/place/White+Palace+V%C3%B5+V%C4%83n+Ki%E1%BB%87t/@10.7232591,106.6116388,17z/data=!3m1!4b1!4m6!3m5!1s0x31752dc82ca47041:0xd7e9915c26b5adae!8m2!3d10.7232591!4d106.6142084!16s%2Fg%2F11sw13brp7",

  /* Link dùng cho iframe trong trang */
  mapEmbedUrl: "https://www.google.com/maps?q=White%20Palace%2059%20V%C3%B5%20V%C4%83n%20Ki%E1%BB%87t%20TPHCM&output=embed",

  /* =========================================================
     5. NỘI DUNG
     ========================================================= */
  quote: "“Thật vui nếu bạn góp mặt tại bữa tiệc mừng hạnh phúc của chúng mình và cùng lưu giữ những khoảnh khắc ý nghĩa.”",
  memoryCaption1: "Hôn nhân không phải là điểm đến, mà là hành trình mà chúng ta cùng nhau bước đi.",
  memoryCaption2: "Chúng mình rất hân hạnh được mời bạn đến chung vui và chứng kiến khoảnh khắc thiêng liêng này.",
  countdownNote: "Một ngày để nhớ trọn đời,\nChúng mình chung bước, gọi mời yêu thương.\nCảm ơn vì đã đến cùng,\nChung vui hạnh phúc – kết vòng phu thê.",



  /* =========================================================
     6. TIMELINE
     ========================================================= */
  timelineTitle: "TIMELINE",
  timeline1Time: "11:00 AM",
  timeline1Label: "Đón khách",
  timeline2Time: "11:00 AM",
  timeline2Label: "Chụp hình",
  timeline3Time: "12:00 PM",
  timeline3Label: "Khai tiệc",

  /* =========================================================
     7. CHIA SẺ LINK
     ========================================================= */
  shareTitle: "Truong Hoang & Thuý Linh - Engagement Invitation",
  shareDescription: "Trân trọng kính mời bạn đến chung vui cùng Truong Hoang & Thuý Linh.",
  shareImage: "https://YOUR-DOMAIN.com/images/share.jpg",

  /* =========================================================
     8. RSVP -> GOOGLE SHEETS

     QUAN TRỌNG:
     - Không dán link Google Sheet bình thường ở đây.
     - Hãy mở Google Sheet -> Extensions -> Apps Script.
     - Dán file google-apps-script.gs đi kèm, Deploy thành Web app.
     - Sau đó dán URL Web app dạng:
       https://script.google.com/macros/s/AKfycb.../exec
       vào googleSheetsEndpoint bên dưới.
     ========================================================= */
  googleSheetsEndpoint: "",

  /* Tên trang tính (tab) mà Apps Script sẽ ghi dữ liệu vào. */
  googleSheetsTabName: "RSVP",

  /* Tùy chọn cũ: chỉ dùng nếu bạn vẫn muốn Formspree làm dự phòng. */
  rsvpEndpoint: ""
};
