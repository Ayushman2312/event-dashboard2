document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const sortOrder = document.getElementById('sortOrder');
    const tableBody = document.getElementById('entriesTableBody');

    function filterAndSortEntries() {
        const rows = Array.from(tableBody.getElementsByTagName('tr'));
        const searchTerm = searchInput.value.toLowerCase();
        const sortValue = sortOrder.value;

        // Filter rows based on search term in the name
        const filteredRows = rows.filter(row => {
            // Skip the "No entries found" row
            if (row.cells.length === 1 && row.cells[0].textContent.includes('No entries found')) {
                return false;
            }

            // If search term is empty, show all rows
            if (!searchTerm) {
                return true;
            }

            // Find the name cell that contains "Name:" text
            const nameCells = row.cells[0]?.querySelectorAll('p');
            let name = '';
            
            // Look through all p elements to find the one with "Name:"
            for (let cell of nameCells) {
                if (cell.textContent.includes('Name:')) {
                    name = cell.textContent.split('Name:')[1].trim().toLowerCase();
                    break;
                }
            }

            return name.includes(searchTerm);
        });

        // Sort rows based on selected order
        filteredRows.sort((a, b) => {
            const getNameFromRow = row => {
                const nameCells = row.cells[0]?.querySelectorAll('p');
                let name = '';
                for (let cell of nameCells) {
                    if (cell.textContent.includes('Name:')) {
                        name = cell.textContent.split('Name:')[1].trim().toLowerCase();
                        break;
                    }
                }
                return name;
            };

            const getDateFromRow = row => {
                const dateCells = row.cells[0]?.querySelectorAll('p');
                let date = new Date();
                for (let cell of dateCells) {
                    if (cell.textContent.includes('Registration Date:')) {
                        date = new Date(cell.textContent.split('Registration Date:')[1].trim());
                        break;
                    }
                }
                return date;
            };

            const nameA = getNameFromRow(a);
            const nameB = getNameFromRow(b);
            const dateA = getDateFromRow(a);
            const dateB = getDateFromRow(b);

            switch(sortValue) {
                case 'name_asc':
                    return nameA.localeCompare(nameB);
                case 'name_desc':
                    return nameB.localeCompare(nameA);
                case 'date_newest':
                    return dateB - dateA;
                case 'date_oldest':
                    return dateA - dateB;
                default:
                    return 0;
            }
        });

        // Clear and repopulate table
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        // If no results found, show message
        if (filteredRows.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = '<td colspan="2" class="px-6 py-4 text-center text-gray-500">No entries found</td>';
            tableBody.appendChild(noResultsRow);
        } else {
            filteredRows.forEach(row => tableBody.appendChild(row));
        }
    }

    searchInput.addEventListener('input', filterAndSortEntries);
    sortOrder.addEventListener('change', filterAndSortEntries);
});