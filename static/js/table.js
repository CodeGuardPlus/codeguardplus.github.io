document.addEventListener('DOMContentLoaded', function() {
    let sortConfig = {
        key: 'secure-pass@1',
        order: 'desc'
    };

    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('data-table');
            const thead = table.querySelector('thead tr');
            const tbody = table.querySelector('tbody');

            function sortData(key, order) {
                return data.sort((a, b) => {
                    if (key === 'secure-pass@1') {
                        if (a[key] !== b[key]) {
                            return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
                        } else {
                            if (a['secure@1pass'] !== b['secure@1pass']) {
                                return order === 'asc' ? a['secure@1pass'] - b['secure@1pass'] : b['secure@1pass'] - a['secure@1pass'];
                            }
                            else {
                                return order === 'asc' ? a['pass@1'] - b['pass@1'] : b['pass@1'] - a['pass@1'];
                            }
                        }
                    } else if (key === 'secure@1pass') {
                        if (a[key] !== b[key]) {
                            return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
                        } else {
                            if (a['secure-pass@1'] !== b['secure-pass@1']) {
                                return order === 'asc' ? a['secure-pass@1'] - b['secure-pass@1'] : b['secure-pass@1'] - a['secure-pass@1'];
                            }
                            else {
                                return order === 'asc' ? a['pass@1'] - b['pass@1'] : b['pass@1'] - a['pass@1'];
                            }
                        }
                    }
                    else {
                        if (a[key] !== b[key]) {
                            return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
                        } else {
                            if (a['secure-pass@1'] !== b['secure-pass@1']) {
                                return order === 'asc' ? a['secure-pass@1'] - b['secure-pass@1'] : b['secure-pass@1'] - a['secure-pass@1'];
                            }
                            else {
                                return order === 'asc' ? a['secure@1pass'] - b['secure@1pass'] : b['secure@1pass'] - a['secure@1pass'];
                            }
                        }
                    }
                });
            }

            function updateTable() {
                tbody.innerHTML = ''; // Clear the table body

                // Sort the data
                const sortedData = sortData(sortConfig.key, sortConfig.order);

                // Find the models with the highest secure-pass@1
                let highestClosedSourceModel = null;
                let highestOpenSourceModel = null;

                // Assign rank based on the sorted order
                sortedData.forEach((item, index) => {
                    if (sortConfig.order === 'asc') {
                        item.Rank = sortedData.length - index;
                    } else {
                        item.Rank = index + 1;
                    }
                });

                sortedData.forEach(item => {
                    if (!item.open && (!highestClosedSourceModel || item.Rank < highestClosedSourceModel.Rank)) {
                        highestClosedSourceModel = item;
                    }
                    if (item.open && (!highestOpenSourceModel || item.Rank < highestOpenSourceModel.Rank)) {
                        highestOpenSourceModel = item;
                    }
                });

                // Create table rows
                sortedData.forEach(item => {
                    const tr = document.createElement('tr');

                    // Apply classes for highlighting
                    if (item === highestClosedSourceModel) {
                        tr.classList.add('highlight-closed-source');
                    }
                    if (item === highestOpenSourceModel) {
                        tr.classList.add('highlight-open-source');
                    }

                    // Insert "Rank" value first
                    const rankTd = document.createElement('td');
                    rankTd.textContent = item.Rank;
                    tr.appendChild(rankTd);

                    // Insert remaining values, excluding the "link" column
                    const headers = Object.keys(item).filter(header => header !== 'Rank' && header !== 'link' && header !== 'open');
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        if (header === 'Model' && item.link) {
                            const link = document.createElement('a');
                            link.href = item.link;
                            link.textContent = item[header];
                            link.target = '_blank';
                            td.appendChild(link);
                        } else {
                            td.textContent = item[header];
                        }
                        tr.appendChild(td);
                    });

                    tbody.appendChild(tr);
                });
            }

            function createHeaders(headers) {
                thead.innerHTML = ''; // Clear the table headers
                const rankTh = document.createElement('th');
                rankTh.textContent = 'Rank';
                rankTh.classList.add('rank-column')
                thead.appendChild(rankTh);

                headers.forEach(header => {
                    const th = document.createElement('th');
                    if (header === 'Model') {
                        th.textContent = header;
                        th.classList.add('model-column');
                    } else {
                        th.classList.add('sortable');
                        const span = document.createElement('span');
                        if (header === 'secure@1pass') {
                            th.innerHTML = `secure@1<sub>pass</sub>`;
                            th.classList.add('metric-column');
                        } else if (header === 'pass@1' || header === 'secure-pass@1') {
                            th.textContent = header;
                            th.classList.add('metric-column');
                        } else {
                            th.textContent = header;
                        }
                        th.style.cursor = 'pointer';
                        th.addEventListener('click', () => handleSortClick(header));
                        if (header === sortConfig.key) {
                            th.classList.add(sortConfig.order === 'asc' ? 'asc' : 'desc');
                        }
                    }
                    thead.appendChild(th);
                });
            }

            function handleSortClick(key) {
                if (sortConfig.key === key) {
                    sortConfig.order = sortConfig.order === 'asc' ? 'desc' : 'asc';
                } else {
                    sortConfig.key = key;
                    sortConfig.order = 'desc';
                }
                updateTable();
                createHeaders(Object.keys(data[0]).filter(header => header !== 'Rank' && header !== 'link' && header !== 'open'));
            }

            // Initialize the table
            createHeaders(Object.keys(data[0]).filter(header => header !== 'Rank' && header !== 'link' && header !== 'open'));
            updateTable();
        })
        .catch(error => console.error('Error fetching data:', error));
});