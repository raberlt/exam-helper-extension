// =======================
// LOAD PROMPT LIST
// =======================

document.addEventListener("DOMContentLoaded", async () => {

    const select = document.getElementById("promptSelect");
    const url = chrome.runtime.getURL("prompts/prompts.json");
  
    const response = await fetch(url);
    const data = await response.json();
  
    data.forEach(file => {
      const option = document.createElement("option");
      option.value = file.file;
      option.textContent = file.name;
      select.appendChild(option);
    });
  
  });
  
  
  // =======================
  // COPY
  // =======================
  
  document.getElementById("copyBtn").addEventListener("click", async () => {
  
    const selectedFile = document.getElementById("promptSelect").value;
    const promptUrl = chrome.runtime.getURL("prompts/" + selectedFile);
  
    const response = await fetch(promptUrl);
    const customPrompt = await response.text();
  
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      args: [customPrompt],
      func: (promptText) => {
  
        let questions = document.querySelectorAll(".question");
        if (!questions.length) {
          return;
        }
  
        const questionsText = Array.from(questions)
          .map((q, index) => {
  
            const question = q.querySelector(".tracnghiem_content_chinh")?.innerText.trim() || "";
  
            const answers = Array.from(q.querySelectorAll(".answer"))
                .map(a => a.innerText.trim())
                .join(" ");
  
            return `Câu ${index+1}: ${question}\n${answers}`;
          })
          .join("\n\n");
  
        const finalText = promptText.trim() + "\n\n" + questionsText;
  
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
  // PASTE
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
          if (!questions.length) {
            return;
          }
  
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
      alert("Không đọc được clipboard.");
    }
  
  });