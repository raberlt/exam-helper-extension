document.getElementById("runBtn").addEventListener("click", async () => {

    console.log("🔘 Button clicked");
  
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
  
    console.log("📄 Active tab:", tab.url);
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, (results) => {
  
      if (!results || !results[0]) {
        console.error("❌ Không lấy được nội dung trang");
        alert("Không lấy được nội dung trang");
        return;
      }
  
      const text = results[0].result;
      console.log("📋 Đã copy text, độ dài:", text.length);
  
      if (!text || text.length < 20) {
        console.warn("⚠️ Nội dung quá ngắn hoặc rỗng");
        alert("Không tìm thấy câu hỏi");
        return;
      }
  
      console.log("📤 Gửi sang GPT...");
  
      chrome.runtime.sendMessage({
        type: "ASK_GPT",
        questionText: "Chỉ gửi đáp án dạng \"A B C D ...\" thôi\n\n" + text
      }, (response) => {
  
        if (!response) {
          console.error("❌ Không nhận được response từ background");
          return;
        }
  
        if (!response.success) {
          console.error("❌ GPT lỗi:", response.error);
          alert("Lỗi GPT: " + response.error);
          return;
        }
  
        console.log("📥 GPT trả về:", response.answer);
  
        const answers = response.answer
          .trim()
          .replace(/[^A-D\s]/g, "")
          .split(/\s+/);
  
        console.log("🧩 Parsed answers:", answers);
        console.log("🔢 Số đáp án:", answers.length);
  
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (answers) => {
  
            console.log("🎯 Bắt đầu điền đáp án");
  
            const radios = document.querySelectorAll("input[type='radio']");
            console.log("🔍 Tìm thấy radio:", radios.length);
  
            let filled = 0;
            let index = 0;
  
            radios.forEach(radio => {
              const value = radio.value?.toUpperCase();
  
              if (value === answers[index]) {
                radio.click();
                filled++;
                index++;
              }
            });
  
            console.log("✅ Đã tick:", filled);
            return {
              totalRadio: radios.length,
              filled: filled
            };
  
          },
          args: [answers]
        }, (fillResult) => {
  
          console.log("📊 Kết quả điền:", fillResult[0].result);
  
          alert("Đã điền xong. Tick được: " + fillResult[0].result.filled);
  
        });
  
      });
  
    });
  
  });