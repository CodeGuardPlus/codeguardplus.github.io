document.addEventListener('DOMContentLoaded', function() {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('data-table');
            const thead = table.querySelector('thead tr');
            const tbody = table.querySelector('tbody');

            // Assuming the JSON data is an array of objects
            if (data.length > 0) {
                // Create table headers
                const headers = Object.keys(data[0]);
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    thead.appendChild(th);
                });

                // Create table rows
                data.forEach(item => {
                    const tr = document.createElement('tr');
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.textContent = item[header];
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});