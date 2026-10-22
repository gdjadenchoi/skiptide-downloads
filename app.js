'use strict';
const repository = 'https://github.com/gdjadenchoi/skiptide-downloads';
const statusLine = document.getElementById('status');
const windowsStatus = document.getElementById('windows-status');
const fallbackVersion = document.getElementById('version').textContent;
const fallbackWindowsVersion = document.getElementById('windows-version').textContent;

function windowsAsset(release) {
  return (release.assets || []).find(asset => asset.state === 'uploaded' &&
    /^SKIPTIDE-Windows\.zip$/i.test(asset.name) &&
    asset.browser_download_url.startsWith(repository + '/releases/download/'));
}

// Include public prereleases: this repository publishes playtests, not store releases.
function newestApk(releases) {
  return releases.filter(release => !release.draft && release.published_at)
    .sort((a,b) => Date.parse(b.published_at)-Date.parse(a.published_at))
    .map(release => ({ release, asset: (release.assets || []).find(asset =>
      asset.state === 'uploaded' && /\.apk$/i.test(asset.name) &&
      asset.browser_download_url.startsWith(repository + '/releases/download/')) }))
    .find(item => item.asset);
}

async function updateDownload() {
  try {
    const response = await fetch('https://api.github.com/repos/gdjadenchoi/skiptide-downloads/releases?per_page=30',
      { headers: { Accept:'application/vnd.github+json' }, cache:'no-cache', signal:AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Release lookup failed');
    const found = newestApk(await response.json());
    if (!found) throw new Error('No APK available');
    const {release,asset} = found;
    // A cached release list must not replace the verified fallback with an older build.
    if (release.tag_name.localeCompare(fallbackVersion + '-playtest', 'en', {numeric:true}) < 0)
      throw new Error('Stale release list');
    document.getElementById('download').href = asset.browser_download_url;
    document.getElementById('version').textContent = release.tag_name.replace(/-playtest$/, '');
    document.getElementById('size').textContent = (asset.size/1024/1024).toFixed(1) + ' MB';
    document.getElementById('release').href = repository + '/releases/tag/' + encodeURIComponent(release.tag_name);
    const date = new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(release.published_at));
    statusLine.textContent = '최신 공개 버전 · ' + date + ' 업데이트';
    const windows = windowsAsset(release);
    if (windows) {
      document.getElementById('download-windows').href = windows.browser_download_url;
      document.getElementById('windows-version').textContent = release.tag_name.replace(/-playtest$/, '');
      windowsStatus.textContent = 'Windows 64비트 · ' + (windows.size/1024/1024).toFixed(1) + ' MB · ' + date + ' 업데이트';
    } else {
      windowsStatus.textContent = '최신 버전의 PC 파일은 아직 없습니다. 확인된 ' + fallbackWindowsVersion + ' Windows 버전을 받습니다.';
    }
    const notes = (release.body || '').split(/\r?\n/).filter(line => /^-\s/.test(line)).slice(0,5);
    const list = document.getElementById('changes');
    list.replaceChildren();
    for (const note of notes.length ? notes : ['변경 내용은 자세히 보기에서 확인하세요.']) {
      const item = document.createElement('li');
      item.textContent = note.replace(/^-\s*/, '');
      list.append(item);
    }
  } catch {
    statusLine.textContent = '자동 확인이 지연되고 있습니다. 버튼은 확인된 ' + fallbackVersion + '를 받습니다.';
    windowsStatus.textContent = '자동 확인이 지연되고 있습니다. 확인된 ' + fallbackWindowsVersion + ' Windows 버전을 받습니다.';
    document.getElementById('release').href = repository + '/releases';
    document.getElementById('release').textContent = '최신 버전 직접 확인 ↗';
  }
}
updateDownload();
