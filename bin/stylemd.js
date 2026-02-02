#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs-extra');
const { marked } = require('marked');
const handlebars = require('handlebars');
const path = require('path');
const grayMatter = require('gray-matter');
const hljs = require('highlight.js');

// Resources for syntax highlighting and Mermaid diagrams
const HIGHLIGHT_CSS = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/default.min.css">';
const MERMAID_SCRIPT = '<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script><script>mermaid.initialize({ startOnLoad: true, securityLevel: "loose" });</script>';
const MATHJAX_SCRIPT = '<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script><script>MathJax = { tex: { inlineMath: [["$", "$"]], displayMath: [["$$", "$$"]] } };</script>';

// -- Marked Customization Start --
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code;
renderer.code = function(code, language, isEscaped) {
  // Mermaid support
  if (language === 'mermaid') {
    return `<div class="mermaid">${code}</div>`;
  }
  // Syntax highlight using highlight.js
  const validLang = hljs.getLanguage(language) ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: validLang }).value;
  return `<pre><code class="hljs ${validLang}">${highlighted}</code></pre>`;
};

// 목차를 위한 헤더 렌더러 재정의
const headingIds = {};
renderer.heading = function(text, level, raw) {
  // 헤더에서 ID 생성
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  let id = escapedText;
  
  // ID 중복 방지
  if (headingIds[id]) {
    headingIds[id]++;
    id = `${id}-${headingIds[id]}`;
  } else {
    headingIds[id] = 1;
  }
  
  return `<h${level} id="${id}"><a href="#${id}" class="header-anchor"></a>${text}</h${level}>`;
};

// 리스트 렌더링 개선
renderer.list = function(body, ordered, start) {
  const type = ordered ? 'ol' : 'ul';
  const startAttribute = (ordered && start !== 1) ? ` start="${start}"` : '';
  return `<${type}${startAttribute}>\n${body}</${type}>\n`;
};

renderer.listitem = function(text) {
  return `<li>${text}</li>\n`;
};

marked.use({ 
  renderer: renderer,
  headerIds: true,
  mangle: false,
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});
// -- Marked Customization End --

// Register Handlebars helper for formatting date
handlebars.registerHelper('formatDate', function() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
});

// Register Handlebars helper for formatting time (HH:MM AM/PM)
handlebars.registerHelper('formatTime', function() {
  const now = new Date();
  // Use English locale for time format
  return now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
});

// Register Handlebars helper for formatting time (HH:MM AM/PM)
handlebars.registerHelper('navHref', function(url, options) {
  // Always use flat URL structure with .html extension
  // root URL
  if (!url || url === '/') {
    return 'index.html';
  }
  
  // Remove leading/trailing slashes
  const parts = url.replace(/^\/+|\/+$/g, '');
  
  // Always return a flat URL structure (slug.html)
  return `${parts}.html`;
});

program
  .version('0.1.0')
  .description('Generate styled HTML pages from Markdown files with themes.')
  .argument('<markdownFile>', 'Path to the Markdown file (.md)')
  .option('-t, --template <name>', 'Template to use (e.g., default, windows98, terminal)', 'default')
  .option('-o, --output <file>', 'Output HTML file path (e.g., index.html)', 'index.html')
  .action(async (markdownFile, options) => {
    const chalk = (await import('chalk')).default;
    const { template, output } = options;

    try {
      const markdownContent = await fs.readFile(markdownFile, 'utf8');
      const htmlContent = marked.parse(markdownContent);

      const templatesDir = path.join(__dirname, '..', 'templates');
      const templatePath = path.join(templatesDir, `${template}.hbs`);
      const defaultTemplatePath = path.join(templatesDir, 'default.hbs');
      let templateSource;

      try {
        templateSource = await fs.readFile(templatePath, 'utf8');
      } catch (error) {
        if (template !== 'default') {
          console.warn(chalk.yellow(`Template "${template}" not found. Using default template.`));
        }
        templateSource = await fs.readFile(defaultTemplatePath, 'utf8');
      }

      const handlebarsTemplate = handlebars.compile(templateSource);
      let finalHtml = handlebarsTemplate({ content: htmlContent });
      // Inject highlight.js CSS, Mermaid script, and MathJax into <head>
      finalHtml = finalHtml.replace('</head>', `${HIGHLIGHT_CSS}${MERMAID_SCRIPT}${MATHJAX_SCRIPT}</head>`);

      await fs.outputFile(output, finalHtml, 'utf8'); // Ensure output directory exists
      console.log(chalk.green(`Successfully generated ${output} using the "${template}" template.`));

    } catch (error) {
      console.error(chalk.red(`Error processing Markdown file: ${error.message}`));
    }
  });

// Add blog commands
const blog = program
  .command('blog')
  .description('Blog mode commands to create and build static sites from markdown files')
  .addHelpText('after', `
Examples:
  # Create a new blog with the default theme
  $ stylemd blog init my-blog

  # Create a new blog with Windows98 theme
  $ stylemd blog init retro-blog -T windows98

  # Build a blog site in the current directory
  $ stylemd blog build

  # Build a blog with custom output directory
  $ stylemd blog build --output dist

  # Build a blog without cleaning the output directory
  $ stylemd blog build --no-clean

Configuration:
  Blog settings are defined in stylemd.config.json file, which includes:
  - Theme selection and customization
  - Content and page directories
  - Navigation links and social media accounts
  - Pagination settings
  - URL structure (flat or nested)
  - Date and time formats
  - Custom CSS and more

Available Themes (use with -T option):
  default, windows98, terminal, geocities, blueprint, macos-classic, 
  amiga-workbench, msdos, c64, vim, retro-console, pixel-art, y2k, 
  frutiger-aero, area51, heartland, hollywood, atlantis
`);

blog.command('init <siteDir>')
  .description('Create a new blog scaffold with specified theme')
  .option('-T, --theme <name>', 'Theme to use for the blog site', 'default')
  .addHelpText('after', `
Description:
  Creates a new blog directory structure with the specified theme.
  Initializes a config file, templates, and sample content.
  
Directory Structure:
  <siteDir>/
  ├── content/         # Your blog posts (markdown files)
  ├── pages/           # Static pages like About, Contact
  ├── public/          # Generated output directory
  ├── templates/       # Theme templates
  └── stylemd.config.json  # Blog configuration
  
Examples:
  # Create a basic blog scaffold
  $ stylemd blog init my-blog
  
  # Create a blog with the windows98 theme
  $ stylemd blog init retro-blog -T windows98
  `)
  .action(async (siteDir, options) => {
    const chalk = (await import('chalk')).default;
    const config = {
      siteTitle: 'My Blog',
      siteDescription: 'A blog generated by stylemd',
      theme: options.theme,
      postsDir: 'content',
      pagesDir: 'pages',
      outputDir: 'public',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm',
      pagination: { enabled: false, perPage: 5 },
      sortOrder: 'newest-first',
      showDrafts: false,
      flatPosts: true,
      flatPages: true,
      author: { name: '', email: '', avatar: '' },
      navigationLinks: [],
      socialLinks: [],
      footerText: ''
    };
    const root = path.resolve(siteDir);
    const templatesSrc = path.join(__dirname, '..', 'templates');
    const templatesDest = path.join(root, 'templates');
    try {
      // Scaffold directories
      await fs.ensureDir(path.join(root, 'content'));
      await fs.ensureDir(path.join(root, 'public'));
      // Copy and restructure templates
      await fs.copy(templatesSrc, templatesDest);
      const files = await fs.readdir(templatesDest);
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const name = path.basename(file, '.hbs');
          const themeDir = path.join(templatesDest, name);
          await fs.ensureDir(themeDir);
          // Read original template and inject dynamic page title
          const rawTemplate = await fs.readFile(path.join(templatesDest, file), 'utf8');
          
          // Special handling for windows98 theme to use original fonts
          let updatedSrc = rawTemplate.replace(/<title>.*<\/title>/, '<title>{{title}} - {{siteTitle}}</title>');
          
          // Remove Google fonts for Windows 98 theme and use system fonts
          if (name === 'windows98') {
            updatedSrc = updatedSrc.replace(/<link href="https:\/\/fonts\.googleapis\.com.*?>/g, '');
            updatedSrc = updatedSrc.replace(/font-family:.*?;/g, "font-family: 'Tahoma', 'MS Sans Serif', sans-serif; /* Original Windows 98 fonts */");
          }
          
          // Add StyleMD watermark CSS to all themes
          const watermarkCSS = `
    /* StyleMD watermark */
    .stylemd-watermark {
      position: fixed;
      right: 10px;
      bottom: 10px;
      font-size: 10px;
      opacity: 0.5;
      color: #777;
      z-index: 100;
      pointer-events: none;
    }
    .stylemd-watermark a {
      color: inherit;
      text-decoration: none;
    }`;
          
          // Add watermark CSS to the style section
          updatedSrc = updatedSrc.replace(/<\/style>/, `${watermarkCSS}\n  </style>`);
          
          // Add watermark HTML before closing body tag
          updatedSrc = updatedSrc.replace(/<\/body>/, `  <div class="stylemd-watermark">Made with <a href="https://github.com/ddukbg/stylemd">StyleMD</a></div>\n</body>`);
          
          // Build post.hbs with metadata + content
          const metadataBlock = `<header>
    <h1>{{title}}</h1>
    <p><small>{{date}} {{time}}</small></p>
    <nav class="nav-links">
      <a href="index.html"${name === 'windows98' ? ' class="win98-button"' : ''}>Home</a>
      {{#each navigationLinks}}
        <a href="{{url}}"${name === 'windows98' ? ' class="win98-button"' : ''}>{{title}}</a>
      {{/each}}
    </nav>
  </header>`;
          const postTemplate = updatedSrc.replace('{{{content}}}', `${metadataBlock}
    {{{content}}}`);
          await fs.writeFile(path.join(themeDir, 'post.hbs'), postTemplate, 'utf8');
          
          // Build index.hbs with listing block
          const listingBlock = `
<header>
  <h1>{{siteTitle}}</h1>
  <p>{{siteDescription}}</p>
  <nav class="nav-links">
    <a href="index.html"${name === 'windows98' ? ' class="win98-button"' : ''}>Home</a>
    {{#each navigationLinks}}
      <a href="{{url}}"${name === 'windows98' ? ' class="win98-button"' : ''}>{{title}}</a>
    {{/each}}
  </nav>
</header>
<section class="post-list">
  <ul>
    {{#each posts}}
    <li><a href="{{url}}">{{title}}</a> — {{date}} {{time}}</li>
    {{/each}}
  </ul>
  {{#if pagination.enabled}}
  <div class="pagination">
    {{!-- Pagination controls can be added here --}}
  </div>
  {{/if}}
</section>
{{#if socialLinks}}
<footer class="social-links">
  {{#each socialLinks}}
    <a href="{{url}}">{{platform}}</a>
  {{/each}}
  <p>{{footerText}}</p>
</footer>
{{else}}
<footer>
  <p>{{footerText}}</p>
</footer>
{{/if}}`;
          const indexTemplate = updatedSrc.replace('{{{content}}}', listingBlock);
          await fs.writeFile(path.join(themeDir, 'index.hbs'), indexTemplate, 'utf8');
          // Remove the standalone .hbs
          await fs.remove(path.join(templatesDest, file));
          // Create page.hbs for custom pages
          const pageMetadataBlock = `<header>
  <h1>{{title}}</h1>
  <nav class="nav-links">
    <a href="index.html"${name === 'windows98' ? ' class="win98-button"' : ''}>Home</a>
    {{#each navigationLinks}}
      <a href="{{url}}"${name === 'windows98' ? ' class="win98-button"' : ''}>{{title}}</a>
    {{/each}}
  </nav>
  </header>`;
          const pageTemplate = updatedSrc.replace('{{{content}}}', `<header>
  <h1>{{title}}</h1>
  <nav class="nav-links">
    <a href="index.html"${name === 'windows98' ? ' class="win98-button"' : ''}>Home</a>
    {{#each navigationLinks}}
      <a href="{{url}}"${name === 'windows98' ? ' class="win98-button"' : ''}>{{title}}</a>
    {{/each}}
  </nav>
  </header>
    {{{content}}}`);
          await fs.writeFile(path.join(themeDir, 'page.hbs'), pageTemplate, 'utf8');
        }
      }
      // Write default config
      await fs.writeJson(path.join(root, 'stylemd.config.json'), config, { spaces: 2 });
      // Scaffold sample pages folder and about.md
      const pagesFolder = path.join(root, config.pagesDir);
      await fs.ensureDir(pagesFolder);
      const aboutMd = `---\ntitle: "About"\nslug: "about"\n---\n\n# About\n\nThis is an example About page.$`;
      await fs.writeFile(path.join(pagesFolder, 'about.md'), aboutMd, 'utf8');
      console.log(chalk.green(`Blog scaffold created at ${root} using '${options.theme}' theme.`));
    } catch (err) {
      console.error(chalk.red(`Error initializing blog: ${err.message}`));
    }
  });
blog.command('build')
  .description('Build a static site from markdown files based on stylemd.config.json')
  .option('--output <dir>', 'Directory to output the generated files', 'public')
  .option('--no-clean', 'Do not clean the output directory before building')
  .addHelpText('after', `
Description:
  Processes markdown files in content/ and pages/ directories,
  applies the selected theme, and generates a complete static website.
  
Process:
  1. Reads stylemd.config.json configuration
  2. Processes markdown content files (blog posts)
  3. Processes markdown page files (static pages)
  4. Generates an index page with post listing
  5. Applies theme templates to all content
  
Examples:
  # Build site using default output directory (public/)
  $ stylemd blog build
  
  # Build site to a custom output directory
  $ stylemd blog build --output dist
  
  # Build without cleaning previous output
  $ stylemd blog build --no-clean
  `)
  .action(async function (cmd) {
    try {
      const configPath = path.join(process.cwd(), 'stylemd.config.json');
      let config = {};
      if (await fs.exists(configPath)) {
        config = require(configPath);
      }

      const outputDir = cmd.output || 'public';
      const buildDir = path.resolve(process.cwd(), outputDir);
      const contentDir = path.resolve(process.cwd(), config.postsDir || 'content');
      const pagesDir = path.resolve(process.cwd(), config.pagesDir || 'pages');
      const templateDir = path.resolve(process.cwd(), config.templateDir || 'templates');
      const themeDir = path.join(templateDir, config.theme || 'default');
      
      // Clean output directory if --clean flag is set (default)
      if (cmd.clean) {
        await fs.remove(buildDir);
      }
      await fs.ensureDir(buildDir);

      // Copy public assets from theme if they exist
      const themePublicDir = path.join(themeDir, 'public');
      if (await fs.exists(themePublicDir)) {
        await fs.copy(themePublicDir, buildDir);
      }

      // Copy user's public assets if they exist
      const userPublicDir = path.join(process.cwd(), 'public');
      if (await fs.exists(userPublicDir) && userPublicDir !== buildDir) {
        await fs.copy(userPublicDir, buildDir);
      }

      // Load the theme templates
      const postTemplate = await fs.readFile(path.join(themeDir, 'post.hbs'), { encoding: 'utf8' });
      const pageTemplate = await fs.readFile(path.join(themeDir, 'page.hbs'), { encoding: 'utf8' });
      const indexTemplate = await fs.readFile(path.join(themeDir, 'index.hbs'), { encoding: 'utf8' });
      
      const compiledPostTemplate = handlebars.compile(postTemplate);
      const compiledPageTemplate = handlebars.compile(pageTemplate);
      const compiledIndexTemplate = handlebars.compile(indexTemplate);

      // Process content directory
      let postFiles = [];
      if (await fs.exists(contentDir)) {
        // Use fs.readdir with recursive option instead of globby
        postFiles = await readDirRecursive(contentDir);
        // Filter only .md files
        postFiles = postFiles.filter(file => file.endsWith('.md'));
        // Make paths relative to contentDir
        postFiles = postFiles.map(file => path.relative(contentDir, file));
      }

      const posts = [];
      for (const file of postFiles) {
        const filePath = path.join(contentDir, file);
        let raw = await fs.readFile(filePath, { encoding: 'utf8' });
        
        const { data, content } = grayMatter(raw, { encoding: 'utf8' });
        
        // Process markdown content
        const html = marked.parse(content);
        
        // Simple date formatter using config
        const formatDate = (d, fmt) => {
          if (!d || isNaN(d.getTime())) return d;
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return (fmt || 'YYYY-MM-DD').replace('YYYY', y).replace('MM', m).replace('DD', day);
        };

        const postDate = data.date ? new Date(data.date) : new Date();

        // Create post object
        const post = {
          ...data,
          title: data.title || path.basename(file, '.md'),
          date: formatDate(postDate, config.dateFormat),
          time: postDate.toLocaleTimeString(config.locale || 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          content: html,
          homeUrl: config.flatPosts ? 'index.html' : '/'
        };
        
        // Determine output path
        let outPath;
        if (config.flatPosts) {
          // Flatten path structure, output directly in build directory
          outPath = path.join(buildDir, path.basename(file, '.md') + '.html');
        } else {
          // Maintain directory structure from content directory
          const relativeDir = path.dirname(file);
          if (relativeDir !== '.') {
            await fs.ensureDir(path.join(buildDir, relativeDir));
          }
          
          // Create a directory for each post and an index.html file
          const postDir = path.join(buildDir, path.dirname(file), path.basename(file, '.md'));
          await fs.ensureDir(postDir);
          outPath = path.join(postDir, 'index.html');
        }
        
        // We'll update the post HTML after processing pages to include the navigation links
        posts.push({
          ...post,
          outPath: outPath,
          url: config.flatPosts 
            ? path.basename(file, '.md') + '.html' 
            : path.join(path.dirname(file), path.basename(file, '.md')) + '/'
        });
      }
      
      // Sort posts by date (newest first)
      posts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date();
        const dateB = b.date ? new Date(b.date) : new Date();
        return dateB - dateA;
      });

      // Process pages directory
      let pageFiles = [];
      if (await fs.exists(pagesDir)) {
        // Use fs.readdir with recursive option instead of globby
        pageFiles = await readDirRecursive(pagesDir);
        // Filter only .md files
        pageFiles = pageFiles.filter(file => file.endsWith('.md'));
        // Make paths relative to pagesDir
        pageFiles = pageFiles.map(file => path.relative(pagesDir, file));
      }
      
      const pages = [];
      // Prepare navigationLinks from pages
      const navLinks = config.navigationLinks || [];

      for (const file of pageFiles) {
        const filePath = path.join(pagesDir, file);
        const rawPage = await fs.readFile(filePath, { encoding: 'utf8' });
        
        const { data: pd, content: pc } = require('gray-matter')(rawPage, { encoding: 'utf8' });
        
        // Process markdown content
        const pageHtmlContent = marked.parse(pc);
        
        // Create page object
        const page = {
          title: pd.title || path.basename(file, '.md'),
          content: pageHtmlContent,
          homeUrl: config.flatPages ? 'index.html' : '/',
          ...pd
        };
        
        // Determine output path
        let pageOut;
        if (config.flatPages) {
          // Flatten path structure, output directly in build directory
          pageOut = path.join(buildDir, path.basename(file, '.md') + '.html');
        } else {
          // Maintain directory structure from pages directory
          const relativeDir = path.dirname(file);
          if (relativeDir !== '.') {
            await fs.ensureDir(path.join(buildDir, relativeDir));
          }
          
          // Create a directory for each page and an index.html file
          const pageDir = path.join(buildDir, path.dirname(file), path.basename(file, '.md'));
          await fs.ensureDir(pageDir);
          pageOut = path.join(pageDir, 'index.html');
        }
        
        // Add page to list for index page
        const pageUrl = config.flatPages 
          ? path.basename(file, '.md') + '.html' 
          : path.join(path.dirname(file), path.basename(file, '.md')) + '/';
        
        pages.push({
          ...page,
          url: pageUrl,
          outPath: pageOut
        });
        
        // Add to navigation links if not already present
        const existingLink = navLinks.find(link => link.title === page.title);
        if (!existingLink) {
          navLinks.push({
            title: page.title,
            url: pageUrl
          });
        }
      }

      // Now that we have all navigation links, generate post HTML
      for (const post of posts) {
        const template = compiledPostTemplate;
        const postHtml = template({
          ...post,
          navigationLinks: navLinks,
          socialLinks: config.socialLinks || [],
          footerText: config.footerText || '© ' + new Date().getFullYear()
        });

        // Add mermaid script to post HTML if not already present
        let finalPostHtml = postHtml;
        if (!finalPostHtml.includes('mermaid.min.js')) {
          finalPostHtml = finalPostHtml.replace('</head>', `${HIGHLIGHT_CSS}${MERMAID_SCRIPT}${MATHJAX_SCRIPT}</head>`);
        }

        await fs.outputFile(post.outPath, finalPostHtml, { encoding: 'utf8' });
      }

      // Now update all pages with the navigation links
      for (const page of pages) {
        const template = compiledPageTemplate;
        const pageHtml = template({
          ...page,
          navigationLinks: navLinks,
          socialLinks: config.socialLinks || [],
          footerText: config.footerText || '© ' + new Date().getFullYear()
        });

        // Add mermaid script to page HTML if not already present
        let finalPageHtml = pageHtml;
        if (!finalPageHtml.includes('mermaid.min.js')) {
          finalPageHtml = finalPageHtml.replace('</head>', `${HIGHLIGHT_CSS}${MERMAID_SCRIPT}${MATHJAX_SCRIPT}</head>`);
        }

        await fs.outputFile(page.outPath, finalPageHtml, { encoding: 'utf8' });
      }

      // Generate index page with updated navigation links
      const indexHtml = compiledIndexTemplate({
        title: 'Home',
        siteTitle: config.siteTitle || 'My Blog',
        siteDescription: config.siteDescription || 'Welcome to my blog',
        navigationLinks: navLinks,
        posts: posts,
        pages: pages,
        pagination: {
          enabled: config.pagination && config.pagination.enabled,
          currentPage: 1,
          totalPages: 1
        },
        socialLinks: config.socialLinks || [],
        footerText: config.footerText || '© ' + new Date().getFullYear()
      });
      
      // Add mermaid script to index if not already present
      let finalIndexHtml = indexHtml;
      if (!finalIndexHtml.includes('mermaid.min.js')) {
        finalIndexHtml = finalIndexHtml.replace('</head>', `${HIGHLIGHT_CSS}${MERMAID_SCRIPT}${MATHJAX_SCRIPT}</head>`);
      }
      
      await fs.outputFile(path.join(buildDir, 'index.html'), finalIndexHtml, { encoding: 'utf8' });
      
      console.log(`Blog site built successfully in ${buildDir}`);
    } catch (err) {
      console.error('Error building blog site:', err);
      console.error('Stack trace:', err.stack);
    }
  });

// Helper function to recursively read directories
async function readDirRecursive(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      const subFiles = await readDirRecursive(filePath);
      result.push(...subFiles);
    } else {
      result.push(filePath);
    }
  }
  
  return result;
}

program.parse(process.argv); 