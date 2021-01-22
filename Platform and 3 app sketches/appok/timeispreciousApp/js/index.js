class Input {
  constructor(activity, where, date) {
    this.activity = activity;
    this.where = where;
    this.date = date;
  }
}

// UI osztály: kezeli az UI feladatokat
class UI {
  static displayInputs() {
    const inputs = Store.getInputs();

    inputs.forEach((input) => UI.addInputToList(input));
  }

  static addInputToList(input) {
    const list = document.querySelector('#Input-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${input.activity}</td>
      <td>${input.where}</td>
      <td>${input.date}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteInput(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#input-form');
    container.insertBefore(div, form);

    // Eltûnik 3 másodpercen belül
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#activity').value = '';
    document.querySelector('#where').value = '';
    document.querySelector('#date').value = '';
  }
}

// tároló osztály
class Store {
  static getInputs() {
    let inputs;
    if(localStorage.getItem('inputs') === null) {
      inputs = [];
    } else {
      inputs = JSON.parse(localStorage.getItem('inputs'));
    }

    return inputs;
  }

  static addBook(input) {
    const inputs = Store.getInputs();
    inputs.push(input);
    localStorage.setItem('inputs', JSON.stringify(inputs));
  }

  static removeInput(date) {
    const inputs = Store.getInputs();

    inputs.forEach((input, index) => {
      if(input.date === date) {
        inputs.splice(index, 1);
      }
    });

    localStorage.setItem('inputs', JSON.stringify(inputs));
  }
}

// Event : Mutatja a beviteleket
document.addEventListener('DOMContentLoaded', UI.displayInputs);

// Event: Bevitel
document.querySelector('#Input-form').addEventListener('submit', (e) => {
  // üres megakadályozása
  e.preventDefault();

  // értékeket bekér
  const activity = document.querySelector('#activity').value;
  const where = document.querySelector('#where').value;
  const date = document.querySelector('#date').value;

  // Hiba kezelés
  if(activity === '' || where === '' || date === '') {
    UI.showAlert('Kerlek tolts ki minden mezot', 'danger');
  } else {
    // példányosítás
    const input = new Input(activity, where, date);

    // bevitel hozzáadása az UI-hoz
    UI.addInputToList(input);

    // bevitel tárolóba rakása
    Store.addInput(input);

    // sikeres hozzáadás
    UI.showAlert('Sikeresen hozzaadva', 'success');

    // mezõk kiürítése
    UI.clearFields();
  }
});

// Event: Bevitel eltávolítása
document.querySelector('#Input-list').addEventListener('click', (e) => {
  // Bevitel törlése az UI-ból
  UI.deleteInput(e.target);

  // Bevitel törlése a tárolóból
  Store.removeInput(e.target.parentElement.previousElementSibling.textContent);

  // Sikeres törlés üzenet
  UI.showAlert('Esemeny torolve', 'success');
});