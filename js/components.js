/**
 * components.js — Loads shared header & footer into any page.
 *
 * Usage:
 *   1. Add <div id="header-placeholder"></div> where the nav should go
 *   2. Add <div id="footer-placeholder"></div> where the footer should go
 *   3. Add <meta name="base-path" content="./"> in <head> (or "../" for subdirectories)
 *   4. Include this script before </body>
 *
 *   For the homepage, also add <meta name="is-homepage" content="true">
 *   so that nav links become anchor links (#about, #skills, etc.).
 */
(function () {
    'use strict';

    var baseMeta = document.querySelector('meta[name="base-path"]');
    var base = baseMeta ? baseMeta.getAttribute('content') : './';
    var isHomepage = document.querySelector('meta[name="is-homepage"]') !== null;

    function loadComponent(id, file) {
        var el = document.getElementById(id);
        if (!el) return Promise.resolve();

        return fetch(base + 'components/' + file)
            .then(function (res) { return res.text(); })
            .then(function (html) {
                // Replace base-path placeholder
                html = html.replace(/\{\{BASE\}\}/g, base);

                // On homepage, convert full nav links to simple anchors
                if (isHomepage && id === 'header-placeholder') {
                    html = html.replace(/href="\.\/index\.html#/g, 'href="#');
                    html = html.replace(/href="\.\/index\.html"/g, 'href="#page-top"');
                }

                // Highlight Blog link on blog pages
                if (id === 'header-placeholder') {
                    var path = window.location.pathname;
                    if (path.indexOf('/blog') !== -1) {
                        html = html.replace(
                            'href="' + base + 'blog/" class="nav-link"',
                            'href="' + base + 'blog/" class="nav-link" style="color: var(--accent);"'
                        );
                    }
                }

                el.innerHTML = html;

                // Re-init mobile nav toggle
                if (id === 'header-placeholder') {
                    var toggle = document.getElementById('navToggle');
                    var links = document.getElementById('navLinks');
                    if (toggle && links) {
                        toggle.addEventListener('click', function () {
                            links.classList.toggle('active');
                            toggle.classList.toggle('active');
                        });
                    }

                    var navbar = document.getElementById('mainNav');
                    if (navbar) {
                        function onScroll() {
                            navbar.classList.toggle('scrolled', window.scrollY > 50);
                        }
                        window.addEventListener('scroll', onScroll, { passive: true });
                        onScroll();
                    }
                }

                // Re-init scroll-to-top
                if (id === 'footer-placeholder') {
                    var scrollTop = document.getElementById('scrollTop');
                    if (scrollTop) {
                        window.addEventListener('scroll', function () {
                            scrollTop.classList.toggle('visible', window.scrollY > 300);
                        }, { passive: true });
                        scrollTop.addEventListener('click', function (e) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        });
                    }
                }
            });
    }

    Promise.all([
        loadComponent('header-placeholder', 'header.html'),
        loadComponent('footer-placeholder', 'footer.html')
    ]).then(function () {
        document.dispatchEvent(new Event('components-loaded'));
    });
})();
