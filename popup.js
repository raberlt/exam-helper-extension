// =======================
// COPY CÂU HỎI
// =======================

document.getElementById("copyBtn").addEventListener("click", async () => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => {
  
        let questions = document.querySelectorAll(".question");
        if (!questions.length) return;
  
        const questionsText = Array.from(questions)
          .map((q, index) => {
  
            const question = q.querySelector(".tracnghiem_content_chinh")?.innerText.trim() || "";
  
            const answers = Array.from(q.querySelectorAll(".answer b"))
              .map((a, i) => `${String.fromCharCode(65+i)}. ${a.innerText.trim()}`)
              .join("\n");
  
            return `Câu ${index+1}: ${question}\n\n${answers}`;
          })
          .join("\n\n====================\n\n");
  
        // 👇 Thêm dòng prompt ở trên cùng
        const finalText =
          'Chỉ gửi đáp án dạng "A B C D ..." thôi\n\n' +
          questionsText;
  
        const textarea = document.createElement("textarea");
        textarea.value = finalText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
  
        alert("Đã copy câu hỏi kèm prompt!");
  
      }
    });
  
  });
  
  
  // =======================
  // PASTE & TỰ ĐIỀN
  // =======================
  
  document.getElementById("pasteBtn").addEventListener("click", async () => {
  
    try {
      const clipboardText = await navigator.clipboard.readText();
  
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        args: [clipboardText],
        func: (input) => {
  
          let answers = input
            .toUpperCase()
            .replace(/[^A-D]/g, " ")
            .split(/\s+/)
            .filter(a => a);
  
          let questions = document.querySelectorAll(".question");
          if (!questions.length) return;
  
          questions.forEach((q, i) => {
  
            let letter = answers[i];
            if (!letter) return;
  
            let index = letter.charCodeAt(0) - 65;
            let radios = q.querySelectorAll("input[type='radio']");
  
            if (radios[index]) {
              radios[index].click();
            }
  
          });
  
          alert("Đã tự động điền đáp án!");
  
        }
      });
  
    } catch (err) {
      alert("Không đọc được clipboard. Hãy cấp quyền clipboard.");
    }
  
  });