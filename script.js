const searchInput = document.querySelector('.search-input');
const dropdown = document.querySelector('.autocomplete-dropdown');
const repositoryList = document.querySelector('.repository-list');

function searchRepositories(query) {
  if (!query) {
    dropdown.innerHTML = '';
    return;
  }

  const url = `https://api.github.com/search/repositories?q=${query}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayResults(data.items);
    })
    .catch(error => {
      console.error("Ошибка:", error);
    });
}

function displayResults(repositories) {
  dropdown.innerHTML = '';

  const topRepositories = repositories.slice(0, 5);

  topRepositories.forEach(repo => {
    const li = document.createElement('li');
    li.textContent = repo.full_name;
    li.addEventListener('click', () => {
      addRepositoryToList(repo);
      searchInput.value = '';
      dropdown.innerHTML = '';
    });
    dropdown.appendChild(li);
  });
}

function addRepositoryToList(repo) {
  const li = document.createElement('li');
  li.className = 'repository-item';

  const info = document.createElement('div');
  info.className = 'info';
  info.innerHTML = `
    <span>Name: ${repo.name}</span>
    <span>Owner: ${repo.owner.login}</span>
    <span>Stars: ${repo.stargazers_count}</span>
  `;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Удалить';
  removeButton.addEventListener('click', () => {
    removeRepository(li);
  });

  li.appendChild(info);
  li.appendChild(removeButton);

  repositoryList.appendChild(li);
}

function removeRepository(li) {
  li.remove();
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

searchInput.addEventListener('input', debounce(() => {
  const query = searchInput.value.trim();
  searchRepositories(query);
}, 300));