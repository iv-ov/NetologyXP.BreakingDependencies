"use strict";

// Этот код можно менять как угодно
var items = {
    "milk": {price: 5.5, type: "Groceries"},
    "eggs": {price: 3.0, type: "Groceries"},
    "coca-cola": {price: 0.4, type: "Groceries"},
    "amoxicillin": {price: 6.7, type: "Groceries"},
    "aspirin": {price: 0.2, type: "PrescriptionDrug"},
    "marijuana": {price: 1.4, type: "PrescriptionDrug"},
    "hamburger": {price: 2, type: "PreparedFood"},
    "ceasar salad": {price: 4.2, type: "PreparedFood"}
};

var itemTypes = {
    "Groceries": {
        "Alabama": 0,
        "Alaska": 0,
        "Arizona": "",
        "Arkansas": 0.015,
        "California": "",
        "Colorado": "",
        "Connecticut": ""
    },
    "PrescriptionDrug": {
        "Alabama": "",
        "Alaska": 0,
        "Arizona": "",
        "Arkansas": "",
        "California": "",
        "Colorado": "",
        "Connecticut": ""
    }
};

var baseTaxes = {
    "Alabama": 0.04,
    "Alaska": 0,
    "Arizona": 0.056,
    "Arkansas": 0.065,
    "California": 0.075,
    "Colorado": 0.029,
    "Connecticut": 0.0635
};


// We were asked to add some states.
// We'll use the helper function to do it easier.
setStateTaxes("Tennessee", 0.07, {"Groceries": 0.05, "PreparedFood": 0, "PrescriptionDrug": 0});
setStateTaxes("Texas", 0.0625, {"Groceries": "", "PreparedFood": 0, "PrescriptionDrug": ""});


function getBaseTax(state) {
    return baseTaxes[state];
}


// TODO: Consider changing taxes data structure so that states could be easyly added and edited without any helper function ("setStateTaxes()")
function setStateTaxes(state, baseTax, taxesByItemTypes) {
    baseTaxes[state] = baseTax;
    for (let type in itemTypes) {
        itemTypes[type][state] = type in taxesByItemTypes ? taxesByItemTypes[type] : 0;
    }
}


function calc(state, itemType) {
    var itemTypeTaxModifier = itemTypes[itemType];
    if (itemTypeTaxModifier[state] === "") {
        return 0;
    }
    return getBaseTax(state) + itemTypeTaxModifier[state];
}


function calculatePriceFor(state, item) {
    var result = null;
    if (items[item].type === "PreparedFood") {
        result = (1 + getBaseTax(state)) * items[item].price;
    } else {
        result = calc(state, items[item].type) * items[item].price + items[item].price;
    }
    return result;
}


class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        var ordersCount = getOrdersCount();
        var state = getSelectedState();
        console.log(`----------${state}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var item = getSelectedItem();
            var result = calculatePriceFor(state, item);
            console.log(`${item}: $${result.toFixed(2)}`);
        }
        console.log(`----Have a nice day!-----`);
    }
}

//############################
//Production - код:
calculateTaxes();

//############################
//Тесты:
var tests = [
    () => {
        // prepare
        let orig_itemTypes = {};
        for (let k in itemTypes) {
            orig_itemTypes[k] = Object.assign({}, itemTypes[k]);
        }

        let orig_baseTaxes = Object.assign({}, baseTaxes);

        // arrange

        // act
        setStateTaxes(
            'SomeNewState',
            0.055,
            {
                "Groceries": 0,
                "PrescriptionDrug": 0.011
            }
        );

        // assert
        let assertResult = assertEquals(0.011, itemTypes["PrescriptionDrug"]["SomeNewState"]);

        // clearing
        itemTypes = orig_itemTypes;
        baseTaxes = orig_baseTaxes;

        return assertResult;
    },
    () => assertEquals(3.0 * (1 + 0.04), calculatePriceFor("Alabama", "eggs")),
    () => assertEquals(0.4 * (1 + 0.015 + 0.065), calculatePriceFor("Arkansas", "coca-cola")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("Alaska", "amoxicillin")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("California", "amoxicillin")),
    () => assertEquals(2 * (1 + 0.0635), calculatePriceFor("Connecticut", "hamburger")),
    () => assertEquals(2 * (1 + 0.07), calculatePriceFor("Tennessee", "hamburger")),
    () => assertEquals(0.4 * (1 + 0.07 + 0.05), calculatePriceFor("Tennessee", "coca-cola")),
    () => assertEquals(2 * (1 + 0.0625), calculatePriceFor("Texas", "hamburger")),
    () => assertEquals(0.2 * (1 + 0.0), calculatePriceFor("Texas", "aspirin"))
];

//Раскомментируйте следующую строчку для запуска тестов:
runAllTests(tests);

//############################
//Код ниже этой строчки не надо менять для выполнения домашней работы

function calculateTaxes() {
    var calculator = new TaxCalculator();
    calculator.calculateTax();
}

function getSelectedItem() {
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState() {
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount() {
    return Math.floor(Math.random() * 3) + 1;
}

//############################
// Кустарный способ писать тесты

function assertEquals(expected, actual) {
    var epsilon = 0.000001;
    var difference = Math.abs(expected - actual);
    if (difference > epsilon || difference === undefined || isNaN(difference)) {
        console.error(`Fail! Expected: ${expected}, Actual: ${actual}`);
        return -1;
    }
    return 0;
}

function runAllTests(tests) {
    var failedTests = tests
        .map((f) => f())
        .map((code) => {
            if (code === -1) {
                return 1
            } else {
                return 0
            }
        })
        .reduce((a, b) => a + b, 0);

    if (failedTests === 0) {
        console.log(`Success: ${tests.length} tests passed.`);
    } else {
        console.error(`Fail: ${failedTests} tests failed.`);
    }
}