class Input {
  constructor(activity, where, date) {
    this.activity = activity;
    this.where = where;
    this.date = date;
  }
}

// UI oszt�ly: kezeli az UI feladatokat
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

    // Elt�nik 3 m�sodpercen bel�l
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#activity').value = '';
    document.querySelector('#where').value = '';
    document.querySelector('#date').value = '';
  }
}

// t�rol� oszt�ly
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
  // �res megakad�lyoz�sa
  e.preventDefault();

  // �rt�keket bek�r
  const activity = document.querySelector('#activity').value;
  const where = document.querySelector('#where').value;
  const date = document.querySelector('#date').value;

  // Hiba kezel�s
  if(activity === '' || where === '' || date === '') {
    UI.showAlert('Kerlek tolts ki minden mezot', 'danger');
  } else {
    // p�ld�nyos�t�s
    const input = new Input(activity, where, date);

    // bevitel hozz�ad�sa az UI-hoz
    UI.addInputToList(input);

    // bevitel t�rol�ba rak�sa
    Store.addInput(input);

    // sikeres hozz�ad�s
    UI.showAlert('Sikeresen hozzaadva', 'success');

    // mez�k ki�r�t�se
    UI.clearFields();
  }
});

// Event: Bevitel elt�vol�t�sa
document.querySelector('#Input-list').addEventListener('click', (e) => {
  // Bevitel t�rl�se az UI-b�l
  UI.deleteInput(e.target);

  // Bevitel t�rl�se a t�rol�b�l
  Store.removeInput(e.target.parentElement.previousElementSibling.textContent);

  // Sikeres t�rl�s �zenet
  UI.showAlert('Esemeny torolve', 'success');
});