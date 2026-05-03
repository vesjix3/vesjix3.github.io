
type Style = {
    id: string;
    name: string;
    href: string
};

const styles: Style[] = [
  { id: 'style-1', name: 'Style 1', href: '/style-1.css' },
  { id: 'style-2', name: 'Style 2', href: '/style-2.css' },
  { id: 'style-3', name: 'Style 3', href: '/style-3.css' }
];

const LINK_ID = 'lab e';
const STORAGE_KEY = 'selected';

function StylesLink(): HTMLLinkElement {
  let link = document.getElementById(LINK_ID) as HTMLLinkElement;
  if (link) return link;
  link = document.createElement('link');
  link.id = LINK_ID;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  return link;
}

function applyStyleByHref(href: string) {
  const link = StylesLink();
  const resolved = new URL(href, document.baseURI).href;
  if (link.href !== resolved) {
	link.href = href;
  }
}

function applyStyleById(id: string) {
  const s = styles.find(x => x.id === id) || styles[0];
  applyStyleByHref(s.href);
  localStorage.setItem(STORAGE_KEY, s.id);
}


function createSwitcher(containerId = 'style-switcher') {
  const container = document.createElement('div');
  container.id = containerId;
  container.style.position = 'fixed';
  container.style.top = '12px';
  container.style.left = '12px';
  container.style.background = 'white)';


  styles.forEach(s => {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.textContent = s.name;
	btn.dataset.styleId = s.id;
	btn.onclick = () => applyStyleById(s.id);
	container.appendChild(btn);
  });

  document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
  StylesLink();
  createSwitcher();
  applyStyleById(styles[0].id);
});
