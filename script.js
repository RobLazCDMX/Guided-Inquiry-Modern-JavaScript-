'use strict';

//BUDGET CONTROLLER
const budgetController = (() => {
   
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
        // this calculate percentage for all since it is in the prototype
        calcPercentage(totalIncome) {
            
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            }
            else {
                this.percentage = -1;
            }
        }

        // This returns the calculation above
        getPercentage() {
            return this.percentage;
        }
    }
    
    class Income extends Expense {
        constructor(id, description, value) {
            super(id, description, value);
            
        }
    }
    
    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((cur) => {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    
    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 
        // -1 sets it to where it doesn't exit yet
    };
    
    return {
        addItem:(type, des, val) => {
            let newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        
        deleteItem:(type, id) => {
            let ids, index;
            
            // An array of ids is created
            ids = data.allItems[type].map((current) => {
               return current.id 
            });
            
            // the index of the element passed in is grabed
            index = ids.indexOf(id);
            
            // if the item exits it is removed from the array
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            } 
        },
        
        calculateBudget: () => {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Checks if the individual is over budget
            if (data.budget < 0) {
                alert("You are over budget");
                document.querySelector(".budget__value").style.background = "#6a040f";
            } else {
                document.querySelector(".budget__value").style.background = "transparent";
            }
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1;
            }
            
        },
        
        calculatePercentages: () => {
            data.allItems.exp.forEach((cur) => {
               cur.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentages: () => {
        // map returns something and stores it in a variable while forEach doesn't store it in a variable
            const allPerc = data.allItems.exp.map((cur) => {
                return cur.getPercentage();
            });
            return allPerc;
        },
      
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing:() => {console.log(data);},
    };
    
})();
    

// UI CONTROLLER
const UIController = (() => {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentangeLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    const formatNumber = (num, decimalCount = 2, decimal = ".", thousands = ",") => {
            let type;
            
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
            
            const negativeSign = num < 0 ? "-" : "";

            let i = parseInt(num = Math.abs(Number(num) || 0).toFixed(decimalCount)).toString();

            let j = (i.length > 3) ? i.length % 3 : 0;
            
             
            return `${negativeSign} ${(j ? i.substr(0, j) + thousands : '')}${i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands)}${(decimalCount ? decimal + Math.abs(num - i).toFixed(decimalCount).slice(2) : "")} ${(type === 'exp' ? '-' : '')}`;
            
        };
        
    
        const nodeListForEach = (list, callback) => {
            for (let i = 0; i < list.length; i++) {
                callback(list[i], i);
            }
        };
        
    return {
        getInput: () => {
            return ({
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            });
        },

        // Adds newly created item to DOM
        addListItem: (obj, type) => {
            let html, newHtml, element;
            // Create HTML string with placeholder text
            

            if (type === 'inc') {
                element =DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
                     
            // Replace the placeholder text with some actual data
            
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
            
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);    
       },
            
            
    
        
        deleteListItem: (selectorID) => {
            
            const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: () => {
            let fields, fieldsArr;
            
            fields = document.querySelectorAll(`${DOMstrings.inputDescription} , ${DOMstrings.inputValue}`);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach((current) => {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        
        displayBudget: (obj) => {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.percentangeLabel).textContent = obj.percentage;

            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentangeLabel).textContent = `${obj.percentage} %`;  
            } else {
                document.querySelector(DOMstrings.percentangeLabel).textContent = '---';
            };
            
        },
        
        displayPercentages: (percentages) => {
            const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, (current, index) => { //nodeListForEach can be reused for any application
                
                if (percentages[index] > 0) {
                    current.textContent = `${percentages[index]} %'`;
                } else {
                    current.textContent = '---';
                }
                
            });
            
        },
        
        displayMonth: () => {
            let now, year, months, month;
            // Current date
            now = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;  
        },
        
        changedType: () => { // change the color of the input boxes
            
            const fields = document.querySelectorAll(
                `${DOMstrings.inputType},
                ${DOMstrings.inputDescription},
                ${DOMstrings.inputValue}`
            );
            
            nodeListForEach(fields, (cur) => {
                cur.classList.toggle('red-focus'); // toggle allows it to go back and forth
                            
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
        getDOMstrings: () => {return DOMstrings;}
    };
    
})();

// GLOBAL APP CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {
    
    const setupEventListeners = () => {
         const DOM = UICtrl.getDOMstrings();
        
         document.querySelector(DOM.inputBtn).addEventListener('click', ctrAddItem);
    
         document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    const updatePercentages = () => {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        const percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
       UICtrl.displayPercentages(percentages);
    };
    
   const updateBudget = () => {
         // 1. Calculate budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        const budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    const ctrAddItem = () => {
         let input, newItem;
        
         // 1. Get the filed input data
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
                // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);


            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();

        } else if (input.description === "") {
            alert("You must submit a description");
        }
        
    };
    
    const ctrDeleteItem = (event) => {
        let itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            // itemID works on its own because if it exist than it is coerced into being true
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();

        }
    };
    
    return {
        init: () => {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

// This starts the app otherwise nothing will ever run because the event listeners are in a private function
controller.init();
























