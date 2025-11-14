const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

marked.setOptions({
  mangle: false,
  headerIds: false,
});

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUTPUT_DIR = path.join(ROOT, 'articles');

const siteMeta = {
  titleSuffix: 'Projxon AI',
  description: 'Projxon AI — quietly building local-first intelligence.',
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/solutions.html', label: 'Vision' },
  { href: '/about.html', label: 'About' },
  { href: '/team.html', label: 'Team' },
  { href: '/articles/index.html', label: 'Articles' },
  { href: '/contact.html', label: 'Contact' },
];

const renderNav = (active) => `
  <nav class="nav" id="nav">
    <div class="nav__container">
      <a href="/" class="nav__logo" aria-label="Projxon AI home">
        <img src="/static/assets/images/logo/wordmark_dark.svg" alt="Projxon AI wordmark">
      </a>
      <ul class="nav__menu">
        ${navLinks
          .map(
            ({ href, label }) =>
              `<li><a href="${href}" class="nav__link${label === active ? ' nav__link--active' : ''}">${label}</a></li>`,
          )
          .join('\n')}
      </ul>
      <div class="nav__actions">
        <a href="mailto:support@projxon.ai" class="btn btn--primary">Join waitlist</a>
        <button class="nav__toggle" id="nav-toggle" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <div class="mobile-menu" id="mobile-menu">
    <ul class="mobile-menu__list">
      ${navLinks
        .map(
          ({ href, label }) =>
            `<li><a href="${href}" class="mobile-menu__link">${label}</a></li>`,
        )
        .join('\n')}
    </ul>
    <div class="mobile-menu__cta">
      <a href="mailto:support@projxon.ai" class="btn btn--primary btn--sm">Join waitlist</a>
    </div>
  </div>
`;

const renderFooter = () => `
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__grid">
        <div>
          <div class="footer__logo">
            <img src="/static/assets/images/logo/wordmark_light.svg" alt="Projxon AI wordmark">
          </div>
          <p class="footer__description">
            Building a local-first AI companion with a tiny, ambitious team. No hype—just thoughtful work.
          </p>
        </div>
        <div class="footer__column">
          <h4 class="footer__column-title">Company</h4>
          <ul class="footer__links">
            ${navLinks
              .map((link) => `<li><a href="${link.href}" class="footer__link">${link.label}</a></li>`)
              .join('\n')}
          </ul>
        </div>
        <div class="footer__column">
          <h4 class="footer__column-title">Stay in touch</h4>
          <ul class="footer__links">
            <li><a href="mailto:support@projxon.ai" class="footer__link">support@projxon.ai</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2025 Projxon AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
`;

const baseHtml = ({ title, body, activeNav, bodyClass = 'page page--light' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${siteMeta.description}">
  <title>${title} | ${siteMeta.titleSuffix}</title>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/svg+xml" href="/static/assets/images/logo/icon.svg">
</head>
<body class="${bodyClass}">
  ${renderNav(activeNav)}
  ${body}
  ${renderFooter()}
  <script src="/js/main.js"></script>
</body>
</html>`;

const renderListing = (posts) => {
  const cards = posts
    .map(
      (post) => `
        <article class="article-card">
          <div class="article-card__meta">
            <span>${formatDate(post.date)}</span>
            <span>${post.readingTime} min read</span>
          </div>
          <h2 class="article-card__title">${post.title}</h2>
          <p class="article-card__summary">${post.summary}</p>
          <div class="article-card__meta">
            <span>By ${post.author}</span>
            ${post.tags && post.tags.length ? `<span>${post.tags.join(', ')}</span>` : ''}
          </div>
          <a class="article-card__link" href="/articles/${post.slug}.html">
            Read article
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </article>
      `,
    )
    .join('\n');

  const body = `
    <section class="articles">
      <div class="container articles__header">
        <div class="section__badge">Articles</div>
        <h1>Notes from the Projxon team</h1>
        <p>Occasional updates about what we're building, why local matters, and how we design for calm.</p>
      </div>
      <div class="container">
        <div class="articles-list">
          ${cards}
        </div>
      </div>
    </section>
  `;

  return baseHtml({ title: 'Articles', body, activeNav: 'Articles' });
};

const renderArticle = (post) => {
  const body = `
    <section class="article-page">
      <div class="article-page__container">
        <div class="article-page__header">
          <div class="section__badge">Articles</div>
          <h1>${post.title}</h1>
          <div class="article-page__meta">
            <span>${formatDate(post.date)}</span>
            <span>${post.readingTime} min read</span>
            <span>By ${post.author}</span>
          </div>
        </div>
        <div class="article-page__content">
          ${marked.parse(post.content)}
        </div>
      </div>
    </section>
  `;

  return baseHtml({ title: post.title, body, activeNav: 'Articles' });
};

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function loadPosts() {
  await ensureDir(POSTS_DIR);
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const yamlFiles = entries.filter(
    (entry) =>
      entry.isFile() &&
      (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')),
  );

  const posts = [];

  for (const file of yamlFiles) {
    const fullPath = path.join(POSTS_DIR, file.name);
    const raw = await fs.readFile(fullPath, 'utf8');
    const data = yaml.load(raw);
    if (!data || typeof data !== 'object') {
      throw new Error(`Post file ${file.name} must export an object`);
    }

    const slug = data.slug || path.parse(file.name).name;
    posts.push({
      ...data,
      slug,
    });
  }

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, 'utf8');
}

async function generate() {
  const posts = await loadPosts();
  await ensureDir(OUTPUT_DIR);

  // Listing page
  await writeFile(path.join(OUTPUT_DIR, 'index.html'), renderListing(posts));

  // Individual articles
  await Promise.all(
    posts.map((post) =>
      writeFile(path.join(OUTPUT_DIR, `${post.slug}.html`), renderArticle(post)),
    ),
  );

  console.log(`Generated ${posts.length} article page(s).`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

