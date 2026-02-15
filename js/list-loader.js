/**
 * Generic List Loader with Pagination and LIFO Sorting
 */
function loadList(containerId, paginationContainerId, dataSourceUrl, itemsPerPage, itemType) {
    const listContainer = document.getElementById(containerId);
    const paginationContainer = document.getElementById(paginationContainerId);

    if (!listContainer) return;

    fetch(dataSourceUrl)
        .then(response => response.json())
        .then(data => {
            // Sort by date descending (LIFO / Newest First)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            let currentPage = 1;
            const totalPages = Math.ceil(data.length / itemsPerPage);

            // Create pagination elements if they don't exist
            if (!paginationContainer.hasChildNodes() && totalPages > 1) {
                const prevButton = document.createElement('button');
                prevButton.id = 'prevBtn';
                prevButton.className = 'pagination-btn';
                prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
                prevButton.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderPage(currentPage);
                    }
                });

                const nextButton = document.createElement('button');
                nextButton.id = 'nextBtn';
                nextButton.className = 'pagination-btn';
                nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
                nextButton.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderPage(currentPage);
                    }
                });

                const infoSpan = document.createElement('span');
                infoSpan.id = 'pageInfo';
                infoSpan.className = 'pagination-info';

                paginationContainer.appendChild(prevButton);
                paginationContainer.appendChild(infoSpan);
                paginationContainer.appendChild(nextButton);
            }

            function renderPage(page) {
                listContainer.innerHTML = '';
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const pageItems = data.slice(start, end);

                pageItems.forEach(item => {
                    const card = document.createElement('article');
                    card.className = 'blog-card animate-on-scroll';

                    // Date formatting
                    const dateObj = new Date(item.date);
                    const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                    let metaHtml = '';
                    let contentHtml = '';

                    if (itemType === 'blog') {
                        metaHtml = `
                            <span><i class="far fa-calendar"></i> ${dateStr}</span>
                            <span><i class="far fa-clock"></i> ${item.readTime}</span>
                        `;
                        contentHtml = `
                            <h3>${item.title}</h3>
                            <p>${item.excerpt}</p>
                            <a href="${item.link}" class="blog-link">
                                Read Article <i class="fas fa-arrow-right"></i>
                            </a>
                        `;
                    } else if (itemType === 'book') {
                        metaHtml = `
                            <span><i class="far fa-calendar"></i> ${dateStr}</span>
                            <span><i class="fas fa-user-edit"></i> ${item.author}</span>
                        `;
                        contentHtml = `
                            <h3>${item.title}</h3>
                            <p>${item.excerpt}</p>
                            <span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span>
                        `;
                    } else if (itemType === 'paper') {
                        metaHtml = `
                            <span><i class="far fa-calendar"></i> ${dateStr}</span>
                            <span><i class="fas fa-user-graduate"></i> ${item.author}</span>
                        `;
                        contentHtml = `
                            <h3>${item.title}</h3>
                            <p>${item.excerpt}</p>
                            <a href="${item.link}" target="_blank" class="blog-link">
                                Read Paper <i class="fas fa-file-pdf"></i>
                            </a>
                        `;
                    }

                    card.innerHTML = `
                        <div class="blog-image">
                            <div class="blog-image-placeholder">
                                <i class="${item.imageIcon || 'fas fa-file'}"></i>
                            </div>
                            <span class="blog-category">${item.category}</span>
                        </div>
                        <div class="blog-content">
                            <div class="blog-meta">${metaHtml}</div>
                            ${contentHtml}
                        </div>
                    `;
                    listContainer.appendChild(card);
                });

                // Update pagination controls
                if (totalPages > 1) {
                    document.getElementById('prevBtn').disabled = currentPage === 1;
                    document.getElementById('nextBtn').disabled = currentPage === totalPages;
                    document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
                    paginationContainer.style.display = 'flex';
                } else {
                    paginationContainer.style.display = 'none';
                }

                // Scroll to top of list container
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            renderPage(currentPage);
        })
        .catch(error => console.error('Error loading data:', error));
}
