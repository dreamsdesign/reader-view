/* globals config */
'use strict';

function save() {
  localStorage.setItem('top-css', document.getElementById('top-style').value || '');
  localStorage.setItem('user-css', document.getElementById('user-css').value || '');
  chrome.runtime.sendMessage({
    cmd: 'update-styling'
  });
  chrome.storage.local.set({
    'user-css': document.getElementById('user-css').value,
    'new-tab': document.getElementById('new-tab').checked,
    'faqs': document.getElementById('faqs').checked,
    'speech-voice': document.getElementById('speech-voice').value,
    'speech-rate': Math.max(Math.min(Number(document.getElementById('speech-rate').value), 3), 0.5),
    'speech-pitch': Math.max(Math.min(Number(document.getElementById('speech-pitch').value), 2), 0)
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });
}

speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices().forEach(o => {
  const option = document.createElement('option');
  option.value = o.voiceURI;
  option.textContent = `${o.name} (${o.lang})`;
  document.getElementById('speech-voice').appendChild(option);
});

function restore() {
  document.getElementById('top-style').value = localStorage.getItem('top-css') || '';
  document.getElementById('user-css').value = localStorage.getItem('user-css') || '';

  chrome.storage.local.get(config.prefs, prefs => {
    document.getElementById('new-tab').checked = prefs['new-tab'];
    document.getElementById('faqs').checked = prefs['faqs'];
    document.getElementById('speech-pitch').value = prefs['speech-pitch'];
    document.getElementById('speech-rate').value = prefs['speech-rate'];
    document.getElementById('speech-voice').value = prefs['speech-voice'];
  });
}
config.load(restore);
document.getElementById('save').addEventListener('click', save);

document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));

document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    const status = document.getElementById('status');
    window.setTimeout(() => status.textContent = '', 750);
    status.textContent = 'Double-click to reset!';
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});

if (navigator.userAgent.indexOf('Firefox') !== -1) {
  document.getElementById('rate').href =
    'https://addons.mozilla.org/en-US/firefox/addon/reader-view/reviews/';
}
else if (navigator.userAgent.indexOf('OPR') !== -1) {
  document.getElementById('rate').href =
    'https://addons.opera.com/en/extensions/details/reader-view-2/#feedback-container';
}

document.getElementById('ref').href = chrome.runtime.getManifest().homepage_url + '#faq5';
