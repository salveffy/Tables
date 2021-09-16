//получаем данные из JSON
fetch('/JSON/data.json')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    addHeadersListener();
    buttCancelEvent();
    buttCorrectEvent(data);
    buttColumnsEvent();
    addButton(data);
    addButList(data);
  });

//Элементы UI
const container = document.querySelector('div.container');
const table = document.querySelector('.table_dark');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
const butCancel = document.querySelector('.cancel');
const butCorrect = document.querySelector('.correct');
const form = document.getElementById('form');
const ulBut = document.querySelector('ul');
const butColumns = ulBut.querySelectorAll('li');

const notesOnPage = 10; // количество строк на странице
let active; // переменная для определения активной страницы
let nameLine = []; // переменная для выноса id строки

// Направление сортировки
const flows = Array.from(headers).map(function (header) {
  return '';
});

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
function listItem({ id, about, eyeColor, name: { firstName, lastName } } = {}) {
  const tableTr = document.createElement('tr');
  tableTr.setAttribute('id', id);
  tableTr.addEventListener('click', function () {
    // Добавление слушателя для редактирования данных
    console.log();
    editForm(id, about, eyeColor, firstName, lastName);
  });

  const firstNameTd = document.createElement('td');
  firstNameTd.classList.add('firstName');
  firstNameTd.textContent = firstName;

  const lastNameTd = document.createElement('td');
  lastNameTd.classList.add('lastName');
  lastNameTd.textContent = lastName;

  const aboutTd = document.createElement('td');
  aboutTd.classList.add('about');
  aboutTd.textContent = about;

  const eyeColorSpan = document.createElement('span')
  eyeColorSpan.textContent = eyeColor;
  eyeColorSpan.style.color = eyeColor;

  const eyeColorDiv = document.createElement('div')
  eyeColorDiv.style.backgroundColor = eyeColor;
  eyeColorDiv.classList.add('eyeColor');

  const eyeColorTd = document.createElement('td');


  eyeColorDiv.appendChild(eyeColorSpan)
  eyeColorTd.appendChild(eyeColorDiv);
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
//Добавление слушателя на кнопку отмены
function buttCancelEvent() {
  butCancel.addEventListener('click', function () {
    form.setAttribute('style', 'display:none;');
    console.log('dasdas');
  });
}
//Добавление слушателя на кнопку сохранения
function buttCorrectEvent(data) {
  butCorrect.addEventListener('click', function () {
    saveInfo(data);
    form.setAttribute('style', 'display:none;');
  });
}

let changeBut = false;

//Добавления слушателей на кнопки отображения столбцов
function buttColumnsEvent() {
  [].forEach.call(butColumns, function (butColumn, id) {
    butColumn.addEventListener('click', function () {
      changeBut = !changeBut;
      unshowColumns(butColumn, id);
    });
  });
}
//TODO: Сделать адекватную функцию
//С помощью id передаем название функции в массив и потом с помощью этого массива сортируем переменную notes в showPages
function unshowColumns(butColumn, id) {
  nameLine.push(id);
  console.log(changeBut);
  if (changeBut) {
    console.log(butColumn);
    butColumn.classList.remove('active');
    headers[id].setAttribute('style', 'display:none');
    const trStroke = tbody.querySelectorAll('td:nth-of-type(' + (id + 1) + ')');
    trStroke.forEach.call(trStroke, function (td) {
      td.style.display = 'none';
    });
  } else {
    butColumn.classList.add('active');
    headers[id].setAttribute('style', 'display:');
    const trStroke = tbody.querySelectorAll('td:nth-of-type(' + (id + 1) + ')');
    trStroke.forEach.call(trStroke, function (td) {
      td.style.display = '';
    });
  }
}

//Функция сортировки
function sortCol(id) {
  const flow = flows[id] || 'asc'; // Получение текущего направления
  const mult = flow === 'asc' ? 1 : -1;
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

function editForm(id, about, eyeColor, firstName, lastName) {
  // Редактирование данных
  const name = document.getElementById('firstName');
  const lName = document.getElementById('lastName');
  const aboutDesc = document.getElementById('about');
  const eyeColr = document.getElementById('eyeColor');
  form.setAttribute('style', 'display:flex;');
  name.value = firstName;
  lName.value = lastName;
  aboutDesc.value = about;
  eyeColr.value = eyeColor;
}

function saveInfo(id, data) {  // Сохранение информации
  let rowTr = document.getElementById(id); // Изменение значения сразу в строке
  let allTd = rowTr.querySelectorAll('td');
  allTd[0].textContent = document.getElementById('firstName').value;
  allTd[1].textContent = document.getElementById('lastName').value;
  allTd[2].textContent = document.getElementById('about').value;
  allTd[3].textContent = document.getElementById('eyeColor').value;
  data.forEach(element => { // Сохранение измененных данных в data
    if(element.id === id) {
      element.name.firstName = document.getElementById('firstName').value;
      element.name.lastName = document.getElementById('lastName').value;
      element.about = document.getElementById('about').value;
      element.eyeColor = document.getElementById('eyeColor').value;
      console.log(element)
    }
  });
}

function addButton(data) {
  // Добавление кнопок пагинации
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  const arrData = Array.from(data);
  let counter = Math.ceil(arrData.length / notesOnPage);
  console.log(container);
  for (let i = 1; i <= counter; i++) {
    let a = document.createElement('a');
    a.innerHTML = i;
    pagination.appendChild(a);
  }
  container.appendChild(pagination);
}

function addButList(data) {
  // Добавление слушателей на кнопки
  const pagination = document.querySelectorAll('a');
  showPages(pagination[0], data);
  for (let item of pagination) {
    item.addEventListener('click', function () {
      showPages(this, data);
    });
  }

  function showPages(index, data) {
    // Алгоритм пагинации
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
    console.log(notes);
    renderAllLines(notes); // функция добавления строк
  }
}
