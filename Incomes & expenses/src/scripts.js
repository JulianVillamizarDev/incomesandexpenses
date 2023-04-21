//globals
let earnings = 0;
let earningsList = [];
let expenses = 0;
let expensesList = [];
let total = earnings - expenses;

document.addEventListener('DOMContentLoaded', () => {
    init();

    //localStorage
    loadLocalStorage();
})

function init() {
    const button = document.querySelector('.btn');
    button.addEventListener('click', inputData);
    setEarnings();
    setExpenses();
    totalGraph();
}

//===============
//===SETTERS=====
//===============

function setTotal() {
    total = earnings - expenses;

    //html
    const totalHTML = document.querySelector('.total-value');
    totalHTML.textContent = `$${total}`;
}

function setEarnings() {
    earnings = earningsList.reduce((acumulado, earning) => {
        return acumulado + earning.value;
    }, 0);

    //html
    const earningHTML = document.querySelector('.earning-value');
    earningHTML.textContent = `$${earnings}`;

    setTotal();

    //create graph
    
    const ctx = document.getElementById('earningsGraph');
    createGraph(ctx, earningsList, 'earning');
}

function setExpenses() {
    expenses = expensesList.reduce((acumulado, expense) => {
        return acumulado + expense.value;
    }, 0);

    //html
    const expenseHTML = document.querySelector('.expense-value');
    expenseHTML.textContent = `$${expenses}`;

    setTotal();

    //create graph
    
    const ctx = document.getElementById('expensesGraph');
    createGraph(ctx, expensesList, 'expense');
}

//=================
//=====INPUTS======
//=================

function inputEarning(value, description) {
    earningsList.push({
        description: description,
        value: value
    });

    showEarnings();

    saveLocalStorage()
}

function inputExpense(value, description) {
    expensesList.push({
        description: description,
        value: value
    });

    showExpenses();

    saveLocalStorage();
}

function inputData() {
    //get values
    const description = document.querySelector('#description');
    const amount = document.querySelector('#amount');
    const selectType = document.querySelector('#tipo');

    if (description.value === '' || amount.value === '') {
        return;
    }

    const amountValue = parseFloat(amount.value);

    if (amountValue === 0) return;

    switch (selectType.value) {
        case 'earning': inputEarning(amountValue, description.value);
            break;
        case 'expense': inputExpense(amountValue, description.value);
            break;
    }

    description.value = '';
    amount.value = '';

}

//====================
//====SHOW DATA========
//====================

//show earnings
function showEarnings() {
    const container = document.querySelector('.data-earning');
    container.innerHTML = '';

    earningsList.forEach((element, index) => {
        const data = generateHTML(element.description, element.value, index);
        container.appendChild(data);
    });

    const deleteBtn = document.querySelectorAll('.btn-delete');

    deleteBtn.forEach((btn) => {
        btn.addEventListener('click', deleteData);
    });

    setEarnings();
}

//show expenses
function showExpenses() {
    const container = document.querySelector('.data-expense');
    container.innerHTML = '';

    expensesList.forEach((element, index) => {
        const data = generateHTML(element.description, element.value, index);
        container.appendChild(data);
    });

    const deleteBtn = document.querySelectorAll('.btn-delete');
    deleteBtn.forEach((btn) => {
        btn.addEventListener('click', deleteData);
    });

    setExpenses();
}

//====================
//====GENERATE HTML========
//====================

function generateHTML(description, value, id) {
    //create components
    const dataContainer = document.createElement('div');
    const dataDescription = document.createElement('p');
    const dataAmount = document.createElement('p');
    const removeData = document.createElement('button');
    //add classes
    dataContainer.classList.add('data');
    dataDescription.classList.add('data-description');
    dataAmount.classList.add('data-amount');
    removeData.classList.add('btn-delete');
    //text content
    dataDescription.textContent = description;
    dataAmount.textContent = `$${value}`;
    removeData.textContent = 'remove';
    //append child into container
    dataContainer.appendChild(dataDescription);
    dataContainer.appendChild(dataAmount);
    dataContainer.appendChild(removeData);
    dataContainer.setAttribute('data-id', id)

    return dataContainer;
}

//====================
//====DELETE DATA========
//====================
function deleteData(e) {
    const type = e.target.parentElement.parentElement.parentElement.children[0].textContent;
    const index = e.target.parentElement.getAttribute('data-id')
    if (type.toLowerCase() === 'incomes') {
        earningsList.splice(index, 1);
        showEarnings();
    } else {
        expensesList.splice(index, 1);
        showExpenses();
    }

    saveLocalStorage();
}

//====================
//====CREATE GRAPHS========
//====================

function createGraph(ctx, list, type) {
    const dataValues = list.map( element => element.value);
    const dataLabels = list.map( (element, index) => '');
    let titleLabel = '';
    let color = '';

    //destroy an existing chart
    if(type === 'earning'){
        color = '#0087D4';
        titleLabel = 'Incomes';
        if(Chart.getChart('earningsGraph')){
            Chart.getChart('earningsGraph').destroy();
            
        }
    }else if( type === 'expense'){
        titleLabel = 'Expenses';
        color = '#F51000';
        if(Chart.getChart('expensesGraph')){
            Chart.getChart('expensesGraph').destroy();
        }
    }

    //Create new Chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataLabels,
            datasets: [{
                label: titleLabel,
                data: dataValues,
                borderWidth: 1,
                borderColor: color
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    totalGraph();
}


function totalGraph(){

    if(Chart.getChart('totalGraph')){
        Chart.getChart('totalGraph').destroy();   
    }

    const labels = earningsList.length>=expensesList.length? earningsList.map( (element, index) => '') : expensesList.map( (element, index) => '');
    const earningsData = earningsList.map( element => element.value);
    const expensesData = expensesList.map( element => element.value);
    const ctx = document.getElementById('totalGraph');



    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Incomes',
                data: earningsData,
                borderWidth: 1,
                borderColor: '#0087D4'
            },
            {
                label: 'Expenses',
                data: expensesData,
                borderWidth: 1,
                borderColor: '#F51000'
            }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

//LocalStorage

function loadLocalStorage(){
    earningsList = JSON.parse( localStorage.getItem('earnings') ) || [];
    showEarnings()
    expensesList = JSON.parse(localStorage.getItem('expenses')) || [];
    showExpenses();
}

function saveLocalStorage(){
    //add into localStorage
    const earningsJSON = JSON.stringify(earningsList)
    localStorage.setItem('earnings', earningsJSON);

    const expensesJSON = JSON.stringify(expensesList)
    localStorage.setItem('expenses', expensesJSON);
}


