# THIỆP CƯỚI ONLINE — HƯỚNG DẪN TỪ A ĐẾN Z

Template này được làm để bạn chỉ cần sửa 1 file chính: `js/config.js`.

## 1. MỞ WEBSITE TRÊN MÁY

Cách nhanh nhất:
- Cài VS Code
- Mở thư mục này
- Cài extension "Live Server"
- Chuột phải `index.html`
- Chọn "Open with Live Server"

## 2. SỬA TÊN, NGÀY, ĐỊA ĐIỂM, ĐIỆN THOẠI

Mở:

`js/config.js`

Sửa các giá trị trong dấu ngoặc kép.

Ví dụ:

```js
groom: "MINH",
bride: "LAN",
weddingDate: "2027-01-20T11:00:00",
```

## 3. THAY ẢNH BÌA

Ảnh mẫu hiện tại:

`images/cover.svg`

Cách dễ:
1. Chuẩn bị ảnh dọc.
2. Đổi tên ảnh thành `cover.jpg`.
3. Trong `index.html`, tìm:
   `images/cover.svg`
4. Đổi thành:
   `images/cover.jpg`

Khuyên ảnh bìa khoảng 1200 x 1800 px, dung lượng dưới 800 KB.

## 4. THAY 6 ẢNH ALBUM

Trong `index.html`, hiện có:
- gallery-1.svg
- gallery-2.svg
- ...
- gallery-6.svg

Bạn có thể thay bằng:
- gallery-1.jpg
- gallery-2.jpg
- ...
- gallery-6.jpg

Sau đó sửa phần mở rộng `.svg` thành `.jpg` trong `index.html`.

## 5. THÊM NHẠC

Bỏ file nhạc của bạn vào:

`music/wedding.mp3`

Lưu ý:
- Trình duyệt iPhone thường chặn autoplay.
- Template đã xử lý bằng nút "MỞ THIỆP".
- Sau khi khách chạm nút, nhạc mới bắt đầu.

## 6. GOOGLE MAPS

Mở Google Maps -> địa điểm -> Chia sẻ -> Sao chép liên kết.

Dán vào `js/config.js`:

```js
mapUrl: "LINK_GOOGLE_MAPS_CỦA_BẠN",
```

## 7. NÚT GỌI

Trong `js/config.js`:

```js
groomPhone: "0900000000",
```

## 8. RSVP — LƯU CÂU TRẢ LỜI

Template hỗ trợ Formspree.

Các bước:
1. Tạo tài khoản Formspree.
2. Tạo form mới.
3. Formspree cung cấp endpoint dạng:
   `https://formspree.io/f/xxxxabcd`
4. Dán vào `js/config.js`:

```js
rsvpEndpoint: "https://formspree.io/f/xxxxabcd"
```

Sau đó khách có thể gửi:
- Họ tên
- Có tham dự hay không
- Số người
- Lời chúc

## 9. ẢNH PREVIEW KHI CHIA SẺ LINK

Hiện template dùng:

`images/share.svg`

Khi website chính thức, nên tạo ảnh `share.jpg` kích thước khoảng 1200 x 630 px.

Sau đó trong `index.html` đổi:

```html
<meta property="og:image" content="images/share.svg">
```

thành URL tuyệt đối:

```html
<meta property="og:image" content="https://tenmiencuaban.com/images/share.jpg">
```

## 10. ĐƯA LÊN NETLIFY

Cách đơn giản:
1. Vào Netlify.
2. Đăng nhập.
3. Tạo site mới.
4. Upload nguyên thư mục website.
5. Netlify cấp link dạng:
   `https://ten-thiep.netlify.app`

Mỗi lần sửa:
- Upload/deploy lại phiên bản mới.

## 11. DOMAIN RIÊNG

Không bắt buộc.

Bạn có thể dùng link Netlify miễn phí.

Nếu mua domain:
- Mua domain từ nhà cung cấp bạn thích.
- Vào Netlify -> Domain management.
- Add domain.
- Làm theo hướng dẫn DNS.

## 12. CHECKLIST TRƯỚC KHI GỬI KHÁCH

- Tên cô dâu chú rể đúng
- Ngày giờ đúng
- Countdown đúng
- Địa chỉ đúng
- Google Maps mở đúng
- Số điện thoại đúng
- Ảnh không bị mờ/cắt mặt
- Nhạc bật sau khi mở thiệp
- RSVP gửi thành công
- Kiểm tra trên iPhone
- Kiểm tra trên Android
- Kiểm tra ảnh preview khi chia sẻ
- Không để ảnh quá nặng

## FILE QUAN TRỌNG NHẤT

Bạn chủ yếu chỉnh:
`js/config.js`

Ảnh:
`images/`

Nhạc:
`music/wedding.mp3`

Giao diện:
`css/style.css`

Nội dung HTML:
`index.html`
