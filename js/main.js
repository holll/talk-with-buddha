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
  handleClean();
  var isAutoEnabled = $("#auto-process").is(":checked");
  navigator.clipboard.readText().then(text => {
    if (text.trim() === "") {
      showError("剪贴板中无内容，无法粘贴。");
      return
    }
    $("#text-decryped").val(text);
    $("#error-alert").addClass("d-none");
    const msg = $("#text-decryped").val();
    const key = $("#text-key").val();
    if (isAutoEnabled && msg.startsWith("佛又曰：")) {
      handleDecrypt(msg, key);
    }
    if (isAutoEnabled && !msg.startsWith("佛又曰：")) {
      handleEncrypt(msg, key);
    }
    $("#text-decryped").blur();
  }).catch(err => showError("无法读取剪贴板内容：" + err.message));
}


function handleCopy() {
  const text = $("#text-encryped").val();
  copyToClipboard(text).catch(err => showError("复制失败：" + err.message));
}

function handleClean() {
  $("#text-decryped").val("");
  $("#text-encryped").val("");
  $("#copy-alert").addClass("d-none");
  $("#error-alert").addClass("d-none");
  $("#text-decryped").focus();
}

$("#btn-encrypt").on("click", handleEncrypt);
$("#btn-decrypt").on("click", handleDecrypt);
$("#btn-copy").on("click", handleCopy);
$("#btn-clean").on("click", handleClean);
$("#btn-paste").on("click", handlePaste);
