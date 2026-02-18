class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.balance = parseFloat(localStorage.getItem('balance')) || 5000;
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
    }

    switchView(view) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(view).classList.remove('hidden');
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
    }

    addExpense() {
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        if (!amount || !category || !description) return;

        const expense = {
            id: Date.now(),
            amount,
            category,
            description,
            date: new Date().toLocaleDateString()
        };

        this.expenses.push(expense);
        this.balance -= amount;
        this.save();
        this.render();
        document.getElementById('expenseForm').reset();
    }

    deleteExpense(id) {
        const expense = this.expenses.find(e => e.id === id);
        if (expense) {
            this.balance += expense.amount;
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.save();
            this.render();
        }
    }

    save() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        localStorage.setItem('balance', this.balance.toString());
    }

    render() {
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        
        document.getElementById('totalBalance').textContent = `$${this.balance.toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('transactionCount').textContent = this.expenses.length;

        this.renderTransactions('recentTransactions', this.expenses.slice(-5).reverse());
        this.renderTransactions('allTransactions', this.expenses.slice().reverse());
    }

    renderTransactions(elementId, transactions) {
        const container = document.getElementById(elementId);
        
        if (transactions.length === 0) {
            container.innerHTML = '<div class="empty-state">No transactions yet</div>';
            return;
        }

        container.innerHTML = transactions.map(exp => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-desc">${this.escape(exp.description)}</div>
                    <span class="transaction-category">${exp.category}</span>
                    <span style="color: #6c757d; font-size: 0.85rem; margin-left: 10px;">${exp.date}</span>
                </div>
                <div class="transaction-amount">-$${exp.amount.toFixed(2)}</div>
                <button class="delete-btn" onclick="app.deleteExpense(${exp.id})">Delete</button>
            </div>
        `).join('');
    }

    escape(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const app = new ExpenseTracker();
