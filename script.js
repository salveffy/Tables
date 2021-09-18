//получаем данные из JSON
fetch('/JSON/data.json')
  .then((response) => response.json())
  .then((data) => {
    addHeadersListener(data);
    buttCancelEvent();
    buttCorrectEvent(data);
    buttColumnsEvent(data);
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
let pageNum; // переменная с открытым номером страницы
let checkPage; // переменная для проверки страницы
let active; // переменная для определения активной страницы
let idStroke; // переменная для выноса id строки
let nameArr = []; // массив с помощью которого происходит выбор отображаемых столбцов

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
  Object.values(linesList).forEach((line) => { // Создание строки для каждого объекта
    const tableTr = listItem(line);
    fragment.appendChild(tableTr);
  });
  tbody.appendChild(fragment); //Вставляем строки в тело таблицы
}

//Создание элементов
function listItem(data) {
  let {
    id,
    about,
    eyeColor,
    name: { firstName, lastName },
  } = data; //Деструктаризация данных
  const tableTr = document.createElement('tr');
  tableTr.setAttribute('id', id);
  tableTr.addEventListener('click', function () {
    // Добавление слушателя для редактирования данных
    editForm(data);
  });
//Проверка массива на неотображаемые колонки
  if (!nameArr.includes(0)) {
    const firstNameTd = document.createElement('td'); //Создание ячейки с именем
    firstNameTd.classList.add('firstName');
    firstNameTd.textContent = firstName;
    tableTr.appendChild(firstNameTd);
  }

  if (!nameArr.includes(1)) {
    const lastNameTd = document.createElement('td'); //Создание ячейки с фамилией
    lastNameTd.classList.add('lastName');
    lastNameTd.textContent = lastName;
    tableTr.appendChild(lastNameTd);
  }

  if (!nameArr.includes(2)) {
    const aboutTd = document.createElement('td'); //Создание ячейки с описанием
    aboutTd.classList.add('about');
    aboutTd.textContent = about;
    tableTr.appendChild(aboutTd);
  }

  if (!nameArr.includes(3)) {
    const eyeColorSpan = document.createElement('span'); //Создание ячейки с цветом глаз
    eyeColorSpan.textContent = eyeColor;
    eyeColorSpan.style.color = eyeColor;
    const eyeColorDiv = document.createElement('div');
    eyeColorDiv.style.backgroundColor = eyeColor;
    eyeColorDiv.classList.add('eyeColor');
    const eyeColorTd = document.createElement('td');
    eyeColorDiv.appendChild(eyeColorSpan);
    eyeColorTd.appendChild(eyeColorDiv);
    tableTr.appendChild(eyeColorTd);
  }
  return tableTr;
}

//Добавление слушателелей на заголовки таблицы
function addHeadersListener(data) {
  [].forEach.call(headers, function (header, id) {
    header.addEventListener('click', function () {
      sortCol(id, data);
    });
  });
}
//Добавление слушателя на кнопку отмены
function buttCancelEvent() {
  butCancel.addEventListener('click', function () {
    form.setAttribute('style', 'display:none;');
  });
}
//Добавление слушателя на кнопку сохранения
function buttCorrectEvent(data) {
  butCorrect.addEventListener('click', function () {
    saveInfo(idStroke, data);
    form.setAttribute('style', 'display:none;');
  });
}

//Добавления слушателей на кнопки отображения столбцов
function buttColumnsEvent(data) {
  [].forEach.call(butColumns, function (butColumn, id) {
    butColumn.addEventListener('click', function () {
      unshowColumns(butColumn, id, data);
    });
  });
}
//Функция для скрытия/отображения колонок
function unshowColumns(butColumn, id, data) {
  if (butColumn.classList.contains('active')) { // если у элемента есть класс active
    nameArr.push(id); // добавляем id колонки в массив
    checkPage = pageNum; // записываем текущую страницу пагинации
    butColumn.classList.remove('active');
    headers[id].setAttribute('style', 'display:none'); // скрываем заголовок
    const trStroke = tbody.querySelectorAll('td:nth-of-type(' + (id + 1) + ')'); // скрываем все ячейки нужной нам колонки
    trStroke.forEach.call(trStroke, function (td) {
      td.style.display = 'none';
    });
  } else if (!butColumn.classList.contains('active')) { // если у элемента нет класса active
    const index = nameArr.indexOf(id);
    nameArr.splice(index, 1); // удаляем id колонки из массива, так как она теперь отображается
    if (checkPage !== pageNum) { // проверка на той же ли странице, нажали на кнопку отображения столбца
      renderPage(data) //Заново рендерим страницу
    }
    butColumn.classList.add('active');
    headers[id].setAttribute('style', 'display:'); //отображаем заголовки
    const trStroke = tbody.querySelectorAll('td:nth-of-type(' + (id + 1) + ')'); // показываем все ячейки нужной нам колонки
    trStroke.forEach.call(trStroke, function (td) {
      td.style.display = '';
    });
  }
}

//Функция сортировки
function sortCol(head, data) {
  const flow = flows[head] || 'asc'; // Получение текущего направления
  const mult = flow === 'asc' ? 1 : -1;
  data.sort(function (a, b) { //сортируем массив объектов
    let cellA;
    let cellB;
    if (head === 0) {
      cellA = a.name.firstName;
      cellB = b.name.firstName;
    } else if (head === 1) {
      cellA = a.name.lastName;
      cellB = b.name.lastName;
    } else if (head === 2) {
      cellA = a.about;
      cellB = b.about;
    } else if (head === 3) {
      cellA = a.eyeColor;
      cellB = b.eyeColor;
    }
    switch (true) {
      case cellA > cellB:
        return 1 * mult;
      case cellA < cellB:
        return -1 * mult;
      case cellA === cellB:
        return 0;
    }
  });

  // Изменение направления
  flows[head] = flow === 'asc' ? 'desc' : 'asc';

  // Добавление новых строк
  renderPage(data);
}

function editForm(data) {
  // Редактирование данных
  let {
    id,
    about,
    eyeColor,
    name: { firstName, lastName },
  } = data; //Деструктаризация данных
  const name = document.getElementById('firstName');
  const lName = document.getElementById('lastName');
  const aboutDesc = document.getElementById('about');
  const eyeColr = document.getElementById('eyeColor');
  form.setAttribute('style', 'display:flex;'); //Заполняем форму данными
  name.value = firstName;
  lName.value = lastName;
  aboutDesc.value = about;
  eyeColr.value = eyeColor;
  idStroke = id;
}
// Сохранение информации
function saveInfo(id, data) {
  // Изменение значения сразу в строке
  let rowTr = document.getElementById(id);
  let allTd = rowTr.querySelectorAll('td');
  allTd[0].textContent = document.getElementById('firstName').value;
  allTd[1].textContent = document.getElementById('lastName').value;
  allTd[2].textContent = document.getElementById('about').value;
  allTd[3].querySelector('span').textContent =
    document.getElementById('eyeColor').value;
  allTd[3].querySelector('div').style.backgroundColor =
    document.getElementById('eyeColor').value;
  allTd[3].querySelector('span').style.color =
    document.getElementById('eyeColor').value;
  data.forEach((element) => {
    // Сохранение измененных данных в data
    if (element.id === id) {
      element.name.firstName = document.getElementById('firstName').value;
      element.name.lastName = document.getElementById('lastName').value;
      element.about = document.getElementById('about').value;
      element.eyeColor = document.getElementById('eyeColor').value;
    }
  });
}

function addButton(data) {
  // Добавление кнопок пагинации
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  const arrData = Array.from(data);
  let counter = Math.ceil(arrData.length / notesOnPage);
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

}

function showPages(index, data) {
  // Алгоритм пагинации
  if (active) {
    active.classList.remove('active');
  }
  active = index;
  index.classList.add('active');
  pageNum = +index.innerHTML;
  renderPage(data);
}

function renderPage(data) { //Рендер одной страницы
  let start = (pageNum - 1) * notesOnPage;
  let end = start + notesOnPage;
  let notes = data.slice(start, end);
  tbody.innerHTML = ''; // очищение таблицы от строк
  renderAllLines(notes); // функция добавления строк
}