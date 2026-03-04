import { OPENAI_API_KEY } from "./config.js";

console.log("✅ Background script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log("📩 Nhận message:", request);

  if (request.type === "ASK_GPT") {

    console.log("🚀 Đang gửi request tới OpenAI...");
    console.log("📏 Độ dài nội dung gửi:", request.questionText.length);

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: request.questionText
          }
        ],
        temperature: 0
      })
    })
    .then(async res => {
      console.log("📡 Status:", res.status);
      const data = await res.json();
      console.log("📦 Raw response:", data);

      if (!data.choices) {
        sendResponse({ success: false, error: JSON.stringify(data) });
        return;
      }

      const answer = data.choices[0].message.content.trim();
      console.log("✅ GPT trả về:", answer);

      sendResponse({ success: true, answer });
    })
    .catch(error => {
      console.error("❌ Lỗi fetch:", error);
      sendResponse({ success: false, error: error.toString() });
    });

    return true;
  }

});