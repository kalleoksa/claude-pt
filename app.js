const VIEW = document.getElementById('view');
const BREADCRUMB = document.getElementById('breadcrumb');
let manifest = null;

async function init() {
  if (window.marked) {
    marked.setOptions({ gfm: true, breaks: false });
  }
  window.addEventListener('hashchange', route);
  try {
    const res = await fetch('manifest.json');
    if (!res.ok) throw new Error('manifest.json: HTTP ' + res.status);
    manifest = await res.json();
  } catch (err) {
    VIEW.innerHTML = '<p class="error">Manifestin lataus epäonnistui: ' + escapeHtml(err.message) + '</p>';
    return;
  }
  route();
}

function route() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash || hash === '/') {
    renderHome();
    return;
  }
  const personMatch = hash.match(/^\/person\/([^/]+)\/?$/);
  if (personMatch) {
    renderPerson(decodeURIComponent(personMatch[1]));
    return;
  }
  const pageMatch = hash.match(/^\/page\/(.+)$/);
  if (pageMatch) {
    renderPage(decodeURIComponent(pageMatch[1]));
    return;
  }
  VIEW.innerHTML = '<p class="error">Tuntematon polku: ' + escapeHtml(hash) + '</p>';
  setBreadcrumb([]);
}

function setBreadcrumb(items) {
  if (!items || items.length === 0) {
    BREADCRUMB.innerHTML = '';
    return;
  }
  const parts = items.map((item, i) => {
    if (i === items.length - 1 || !item.href) {
      return '<span>' + escapeHtml(item.label) + '</span>';
    }
    return '<a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + '</a>';
  });
  BREADCRUMB.innerHTML = parts.join('<span class="sep">/</span>');
}

function renderHome() {
  setBreadcrumb([]);
  const persons = manifest.persons.map(p => {
    const latest = p.plans.find(x => x.latest) || p.plans[0];
    const meta = latest ? 'Uusin ohjelma: ' + escapeHtml(latest.version) : '';
    return '<li><a href="#/person/' + encodeURIComponent(p.id) + '">'
      + '<div class="card-title">' + escapeHtml(p.name) + '</div>'
      + (meta ? '<div class="card-meta">' + meta + '</div>' : '')
      + '</a></li>';
  }).join('');

  const research = manifest.research.map(r =>
    '<li><a href="#/page/' + encodeURIComponent(r.path) + '">'
    + '<div class="card-title">' + escapeHtml(r.title) + '</div>'
    + '</a></li>'
  ).join('');

  VIEW.innerHTML =
    '<section class="section"><h2>Henkilöt</h2><ul class="card-list">' + persons + '</ul></section>'
    + '<section class="section"><h2>Tutkimusdokumentit</h2><ul class="card-list">' + research + '</ul></section>';
  window.scrollTo(0, 0);
}

async function renderPerson(id) {
  const person = manifest.persons.find(p => p.id === id);
  if (!person) {
    VIEW.innerHTML = '<p class="error">Henkilöä ei löytynyt: ' + escapeHtml(id) + '</p>';
    setBreadcrumb([{ label: 'Etusivu', href: '#/' }, { label: id }]);
    return;
  }
  setBreadcrumb([{ label: 'Etusivu', href: '#/' }, { label: person.name }]);

  const latest = person.plans.find(x => x.latest) || person.plans[0];
  const older = person.plans.filter(x => x !== latest);

  const profileLink = '<details class="collapse"><summary>Henkilöprofiili</summary>'
    + '<div class="collapse-body"><ul><li><a href="#/page/'
    + encodeURIComponent(person.profile) + '">Avaa profiili</a></li></ul></div></details>';

  const olderHtml = older.length
    ? '<details class="collapse"><summary>Aiemmat ohjelmaversiot</summary><div class="collapse-body"><ul>'
      + older.map(p => '<li><a href="#/page/' + encodeURIComponent(p.path) + '">Ohjelma ' + escapeHtml(p.version) + '</a></li>').join('')
      + '</ul></div></details>'
    : '';

  const researchHtml = '<details class="collapse"><summary>Tutkimusdokumentit</summary><div class="collapse-body"><ul>'
    + manifest.research.map(r => '<li><a href="#/page/' + encodeURIComponent(r.path) + '">' + escapeHtml(r.title) + '</a></li>').join('')
    + '</ul></div></details>';

  const planSection = latest
    ? '<section class="section"><h2>Uusin ohjelma (' + escapeHtml(latest.version) + ')</h2>'
      + '<div id="plan-content" class="markdown"><p class="loading">Ladataan ohjelmaa…</p></div></section>'
    : '';

  VIEW.innerHTML =
    '<section class="section">' + profileLink + olderHtml + researchHtml + '</section>'
    + planSection;
  window.scrollTo(0, 0);

  if (latest) {
    await loadAndRenderMarkdown(latest.path, document.getElementById('plan-content'));
  }
}

async function renderPage(path) {
  const person = manifest.persons.find(p =>
    p.profile === path || p.plans.some(pl => pl.path === path)
  );
  const research = manifest.research.find(r => r.path === path);

  const crumbs = [{ label: 'Etusivu', href: '#/' }];
  if (person) {
    crumbs.push({ label: person.name, href: '#/person/' + encodeURIComponent(person.id) });
    if (person.profile === path) {
      crumbs.push({ label: 'Profiili' });
    } else {
      const plan = person.plans.find(pl => pl.path === path);
      crumbs.push({ label: plan ? 'Ohjelma ' + plan.version : fileBaseName(path) });
    }
  } else if (research) {
    crumbs.push({ label: research.title });
  } else {
    crumbs.push({ label: fileBaseName(path) });
  }
  setBreadcrumb(crumbs);

  VIEW.innerHTML = '<div id="page-content" class="markdown"><p class="loading">Ladataan…</p></div>';
  await loadAndRenderMarkdown(path, document.getElementById('page-content'));
  window.scrollTo(0, 0);
}

async function loadAndRenderMarkdown(path, container) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(path + ': HTTP ' + res.status);
    const text = await res.text();
    const html = marked.parse(text);
    container.innerHTML = postProcess(html, path);
    container.querySelectorAll('table').forEach(t => {
      if (t.parentElement && t.parentElement.classList.contains('table-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  } catch (err) {
    container.innerHTML = '<p class="error">Sivun lataus epäonnistui: ' + escapeHtml(err.message) + '</p>';
  }
}

function postProcess(html, currentPath) {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = html;
  doc.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      return;
    }
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const resolved = resolvePath(currentPath, href);
    if (/\.md(\?|#|$)/i.test(resolved)) {
      a.setAttribute('href', '#/page/' + encodeURI(resolved));
    } else {
      a.setAttribute('href', resolved);
    }
  });
  return doc.body.innerHTML;
}

function resolvePath(currentPath, relative) {
  let frag = '';
  const fragIdx = relative.indexOf('#');
  if (fragIdx >= 0) {
    frag = relative.slice(fragIdx);
    relative = relative.slice(0, fragIdx);
  }
  if (!relative) return currentPath + frag;
  if (relative.startsWith('/')) return relative.slice(1) + frag;
  const baseParts = currentPath.split('/');
  baseParts.pop();
  for (const part of relative.split('/')) {
    if (part === '..') baseParts.pop();
    else if (part === '.' || part === '') continue;
    else baseParts.push(part);
  }
  return baseParts.join('/') + frag;
}

function fileBaseName(path) {
  return path.split('/').pop().replace(/\.md$/i, '');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

init();
