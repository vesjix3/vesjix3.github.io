class Todo {
    constructor() {
        this.tasks = [];
        this.term = '';
        this.load();
        this.bindEvents();
        this.draw();
    }

    add(text, date = '') {
        text = text.trim();
        if (text.length < 3 || text.length > 255) {
            alert('zadanie musi miec od 3 do 255 znakow.')
            return false;
        }
        if (date !== '') {
            if (!this.isDateValid(date)) {
                alert('data nie moze byc w przeszlosci');
                return false;
            }
        }
        this.tasks.push({id: Date.now(), text, date});
        this.save();
        this.draw();
        return true;
    }

    remove(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.draw();

    }

    update(id, text, date) {
        text = text.trim();
        if (text.length < 3 || text.length > 255) return;
        if (date !== '' && !this.isDateValid(date)) {
            alert('data nie moze byc w przeszlosci');
            return;
        }
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        task.text = text;
        task.date = date;
        this.save();
        this.draw();
    }

    get filteredTasks() {
        const q = this.term.trim();
        if (q.length < 2) return this.tasks;
        return this.tasks.filter(t => t.text.toLowerCase().includes(q.toLowerCase()));
    }

    save() {
        localStorage.setItem('todo_tasks', JSON.stringify(this.tasks));
    }

    load() {
        const data = localStorage.getItem('todo_tasks');
        this.tasks = data ? JSON.parse(data) : [];
    }

    highlight(text, term) {
        if (!term || term === '') return text;
        if (!term || term === '' || term.length < 2) return text;
        let result = '';
        let termIndex = 0;
        for (let i = 0; i < text.length; i++) {
            if (termIndex < term.length && text[i].toLowerCase() === term[termIndex].toLowerCase()) {
                result += `<mark style="background-color:#7cb4d2; color:#1f1f1f;">${text[i]}</mark>`;

                termIndex++;
            } else {
                result += text[i];
            }
        }
        return result;
    }

    isDateValid(date) {
        if (date === '') return true;
        const d = new Date(date);
        if (isNaN(d.getTime())) return false;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return d >= now;
    }

    draw() { //przy tym troche czat pomagal
        const list = document.getElementById('task-list');
        list.innerHTML = '';

        this.filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;

            const spanText = document.createElement('span');
            spanText.className = 'task-text';
            spanText.innerHTML = this.highlight(task.text, this.term);
            spanText.addEventListener('click', () => this.startEdit(li, task));

            const spanDate = document.createElement('span');
            spanDate.className = 'task-date';
            spanDate.textContent = task.date ? task.date.replace('T', ' ') : '';
            spanDate.addEventListener('click', () => this.startEdit(li, task));


            const btn = document.createElement('button');
            btn.className = 'task-delete';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Usuń zadanie');
            btn.textContent = '🗑';
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.remove(task.id);
            });

            li.append(spanText, spanDate, btn);
            list.appendChild(li);
        });
    }
    startEdit(li, task) {  //pomagal czat
        if (li.querySelector('input')) return;
        li.innerHTML = '';

        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.value = task.text;
        inputText.maxLength = 255;
        inputText.className = 'edit-text';
        inputText.style.flex = '1';

        const inputDate = document.createElement('input');
        inputDate.type = 'datetime-local';
        inputDate.value = task.date;
        inputDate.className = 'edit-date';

        const btn = document.createElement('button');
        btn.className = 'task-delete';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'usun zadanie');
        btn.textContent = '🗑';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(task.id);
        });

        const save = () => {
            this.update(task.id, inputText.value, inputDate.value);
        };


        li.addEventListener('focusout', (e) => {
            if (!li.contains(e.relatedTarget)) save();
        });

        inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
        });

        li.append(inputText, inputDate, btn);
        inputText.focus();
    }


    bindEvents() {

        const addBtn = document.querySelector('#save button');
        addBtn.addEventListener('click', () => {
            const textInput = document.querySelector('#add input');
            const dateInput = document.querySelector('#data input');
            if (this.add(textInput.value, dateInput.value)) {
                textInput.value = '';
                dateInput.value = '';
            }
        });


        document.querySelector('#add input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.querySelector('#save button').click();
        });


        document.querySelector('#search input').addEventListener('input', (e) => {
            this.term = e.target.value;
            this.draw();
        });
    }
}

document.todo = new Todo();

