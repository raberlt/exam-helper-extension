# 📝 Tool Copy Câu Hỏi Trắc Nghiệm

Công cụ hỗ trợ copy câu hỏi kèm prompt mặc định hoặc prompt custom.

## 🔹 Tính năng

- Copy câu hỏi với prompt mặc định.
- Dropdown chọn nhiều file prompt trong thư mục `/prompts`.
- Tự động load toàn bộ file prompt (không cần sửa code khi thêm file mới).
- Hỗ trợ file `.ignore` để ẩn prompt không muốn hiển thị.
- Có nút Copy và Paste.

## 📂 Cấu trúc
project/
├── index.html
├── script.js
├── style.css
└── prompts/
├── level2_tc1_1.txt
└── .ignore

## ⚙️ Cách dùng

1. Thêm file `.txt` vào thư mục `/prompts`.
2. Reload trang.
3. Chọn prompt từ dropdown và bấm Copy.

Prompt sẽ luôn được đặt phía trên nội dung câu hỏi.