document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#newsTable')) {
        loadNews();
    }

    if (document.querySelector('#newsForm')) {
        document.querySelector('#newsForm').addEventListener('submit', handleFormSubmit);
    }
});

async function loadNews() {
    const response = await fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news');
    const newsList = await response.json();
    const tbody = document.querySelector('#newsTable tbody');
    tbody.innerHTML = '';

    newsList.forEach(news => {
        const row = createNewsRow(news);
        tbody.appendChild(row);
    });
}

async function deleteNews(id, button) {
    await fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${id}`, { method: 'DELETE' });
    const row = button.closest('tr');
    row.classList.add('fadeOut'); 
    row.addEventListener('animationend', () => {
        row.remove();  
    });
}



async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const newsData = {
        title: form.title.value,
        description: form.description.value,
        category: form.category.value,
        editorFirstName: form.editorFirstName.value,
        editorLastName: form.editorLastName.value
    };

    if (form.dataset.id) {
        await updateNews(form.dataset.id, newsData);
    } else {
        await createNews(newsData);
    }

    location.href = 'index.html';
}

async function createNews(newsData) {
    await fetch('https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData)
    });
}

async function updateNews(id, newsData) {
    await fetch(`https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData)
    });
}

function createNewsRow(news) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${news.id}</td>
        <td>${news.title}</td>
        <td>${news.category}</td>
        <td>${news.likes}</td>
        <td>${news.dateUpdated}</td>
        <td>${news.dateCreated}</td>
        <td style="display: flex; align-items: center;">
            <button class="btn delete" onclick="deleteNews(${news.id}, this)">Delete</button>
            <button class="btn update" onclick="editNews(${news.id})" style="margin-top: 5px;">Update</button>
        </td>
    `;
    return row;
}


