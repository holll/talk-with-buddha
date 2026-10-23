import { encrypt as doEncrypt, decrypt as doDecrypt } from "./cryptoUtils.js";
import { showError, copyToClipboard } from "./domUtils.js";

// $("#error-alert").addClass("d-none");
// $("#copy-alert").addClass("d-none");

function handleEncrypt() {
  const msg = $("#text-decryped").val();
  const key = $("#text-key").val();
  if (!msg) return showError("无言者，纵真神再临，亦不可渡。（请输入待加密的明文）");
  try {
    const result = doEncrypt(msg, key);
    $("#text-encryped").val(result);
    $("#error-alert").addClass("d-none");
    $("#copy-alert").addClass("d-none");
  } catch (err) {
    showError("加密失败：" + err.message);
  }
}

function handleDecrypt() {
  const msg = $("#text-decryped").val();
  const key = $("#text-key").val();
  if (!msg) return showError("无言者，纵真神再临，亦不可渡。（请输入待解密的密文）");
  try {
    const result = doDecrypt(msg, key);
    $("#text-encryped").val(result);
    $("#error-alert").addClass("d-none");
    $("#copy-alert").addClass("d-none");
  } catch (err) {
    showError("施主可曾记得此为何高僧所言？（佛语有误或密钥错误）");
  }
}

function handlePaste() {
  // 非 HTTPS（含用局域网 IP / file:// 打开）时浏览器不提供 Clipboard API，
  // 直接调用会抛 TypeError 且界面上毫无反馈，这里先给出明确提示。
  if (!navigator.clipboard || !window.isSecureContext) {
    return showError("当前页面不是 HTTPS，浏览器禁止读取剪贴板，请长按输入框手动粘贴。");
  }
  handleClean();
  var isAutoEnabled = $("#auto-process").is(":checked");
  navigator.clipboard.readText().then(text => {
    if (text.trim() === "") {
      showError("剪贴板中无内容，无法粘贴。");
      return
    }
    $("#text-decryped").val(text);
    $("#error-alert").addClass("d-none");
    if (isAutoEnabled) {
      // 这两个处理函数自己从输入框取值，无需再传参
      if (text.startsWith("佛又曰：")) handleDecrypt();
      else handleEncrypt();
    }
    $("#text-decryped").blur();
  }).catch(err => showError("无法读取剪贴板内容：" + err.message));
}


function handleCopy() {
  const text = $("#text-encryped").val();
  if (!text) return showError("佛的答案尚是空白，暂无可复制的内容。");
  copyToClipboard(text).catch(err => showError("复制失败：" + err.message));
}

function handleClean() {
  $("#text-decryped").val("");
  $("#text-encryped").val("");
  $("#copy-alert").addClass("d-none");
  $("#error-alert").addClass("d-none");
  // 移动端点「清空」不该把键盘顶出来，只在有精确指针（鼠标/触控板）时聚焦
  if (window.matchMedia("(pointer: fine)").matches) $("#text-decryped").focus();
}

$("#btn-encrypt").on("click", handleEncrypt);
$("#btn-decrypt").on("click", handleDecrypt);
$("#btn-copy").on("click", handleCopy);
$("#btn-clean").on("click", handleClean);
$("#btn-paste").on("click", handlePaste);
