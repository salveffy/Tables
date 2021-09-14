//получаем данные из JSON
fetch('/JSON/data.json')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    addHeadersListener();
    addButton(data);
    addButList(data);
  });

//Элементы UI
const container = document.querySelector('div.container');
const table = document.querySelector('.table_dark');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

const notesOnPage = 10; // количество строк на странице
let active; // переменная для определения активной страницы

// Направление сортировки
const flows = Array.from(headers).map(function(header) {
  return '';
})

//Заполнение таблицы
function renderAllLines(linesList) {
  if (!linesList) {
    //Проверка, есть ли данные
    console.error('Проблема с получением данных');
    return;
  }
  const fragment = document.createDocumentFragment();
  Object.values(linesList).forEach((line) => {
    const tableTr = listItem(line);
    fragment.appendChild(tableTr);
  });
  tbody.appendChild(fragment);
}

//Создание элементов
function listItem({id, about, eyeColor, name: { firstName, lastName } } = {}) {
  const tableTr = document.createElement('tr');
  tableTr.setAttribute('id',id);
  tableTr.addEventListener('click', function(e){ // Добавление слушателя для редактирования данных
    console.log()
    editForm(id, about, eyeColor, firstName, lastName);
  });

  const firstNameTd = document.createElement('td');
  firstNameTd.textContent = firstName;

  const lastNameTd = document.createElement('td');
  lastNameTd.textContent = lastName;

  const aboutTd = document.createElement('td');
  aboutTd.textContent = about;

  const eyeColorTd = document.createElement('td');
  eyeColorTd.textContent = eyeColor;

  tableTr.appendChild(firstNameTd);
  tableTr.appendChild(lastNameTd);
  tableTr.appendChild(aboutTd);
  tableTr.appendChild(eyeColorTd);

  return tableTr;
}

//Добавление слушателелей на заголовки таблицы
function addHeadersListener() {
  [].forEach.call(headers, function (header, id) {
    header.addEventListener('click', function () {
      sortCol(id);
    });
  });
}

//Функция сортировки
function sortCol(id) {
  const flow = flows[id] || 'asc'; // Получение текущего направления
  const mult = (flow === 'asc') ? 1 : -1;
  const rows = tbody.querySelectorAll('tr');
  const newArr = Array.from(rows);

  newArr.sort(function (a, b) {
    const cellA = a.querySelectorAll('td')[id].innerHTML;
    const cellB = b.querySelectorAll('td')[id].innerHTML;
    switch (true) {
      case cellA > cellB:
        return 1 * mult;
      case cellA < cellB:
        return -1 * mult;
      case cellA === cellB:
        return 0;
    }
  });

  // Удаление старых строк
  [].forEach.call(rows, function (row) {
    tbody.removeChild(row);
  });

  // Изменение направления
  flows[id] = flow === 'asc' ? 'desc' : 'asc';

  // Добавление новых строк
  newArr.forEach(function (newItem) {
    tbody.appendChild(newItem);
  });
}

function editForm(id, about, eyeColor, firstName, lastName) { // Редактирование данных
  const form = document.getElementById('form');
  const name = document.getElementById('firstName');
  const lName = document.getElementById('lastName');
  const aboutDesc = document.getElementById('about');
  const eyeColr = document.getElementById('eyeColor');
  const butCancel = document.querySelector('.cancel');
  const butCorrect = document.querySelector('.correct')
  form.setAttribute('style','display:flex;');
  name.value = firstName;
  lName.value = lastName;
  aboutDesc.value = about;
  eyeColr.value = eyeColor;
  butCancel.addEventListener('click', function() {
    form.setAttribute('style','display:none;');
  })
  butCorrect.addEventListener('click', function() {
    saveInfo(id)
    form.setAttribute('style','display:none;');
  })
}

function saveInfo(id) {// TODO: Остановился тут
  let rowTr = document.getElementById(id);
  let allTd = rowTr.querySelectorAll('td');
  allTd[0].setAttribute('value',document.getElementById('firstName').value );
  allTd[1].textContent = document.getElementById('lastName').value;
  allTd[2].setAttribute = document.getElementById('about').value;
  allTd[3].setAttribute = document.getElementById('eyeColor').value;
  console.log(...allTd);
}

function addButton(data) { // Добавление кнопок пагинации
  const pagination = document.createElement('div')
  pagination.classList.add('pagination')
  const arrData = Array.from(data);
  let counter = Math.ceil(arrData.length / notesOnPage);
  console.log(container)
  for (let i = 1; i <= counter; i++) {
    let a = document.createElement('a');
    a.innerHTML = i;
    pagination.appendChild(a);
  }
  container.appendChild(pagination);
}

function addButList(data) { // Добавление слушателей на кнопки
  const pagination = document.querySelectorAll('a');
  showPages(pagination[0], data);
  for (let item of pagination) {
    item.addEventListener('click', function() {
      showPages(this, data)
  })}

function showPages(index, data) { // Алгоритм пагинации
  if (active) {
    active.classList.remove('active');
  }
  active = index;
  index.classList.add('active');
  let pageNum = +index.innerHTML;
  let start = (pageNum - 1) * notesOnPage;
  let end = start + notesOnPage;
  let notes = data.slice(start, end);
  tbody.innerHTML = ''; // очищение таблицы от строк
  renderAllLines(notes); // функция добавления строк
}
}

