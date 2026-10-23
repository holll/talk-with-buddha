// domUtils.js
const AUTO_HIDE_MS = 3200;
const hideTimers = {};

function hideLater(id) {
  clearTimeout(hideTimers[id]);
  hideTimers[id] = setTimeout(() => {
    $("#" + id).addClass("d-none");
  }, AUTO_HIDE_MS);
}

export function showError(msg) {
  $("#error-alert").text(msg).removeClass("d-none");
  $("#copy-alert").addClass("d-none");
  hideLater("error-alert");
}

export function showCopySuccess() {
  $("#copy-alert").removeClass("d-none");
  $("#error-alert").addClass("d-none");
  hideLater("copy-alert");
}

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(showCopySuccess);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (successful) showCopySuccess();
    else throw new Error("复制失败");
  }
}
