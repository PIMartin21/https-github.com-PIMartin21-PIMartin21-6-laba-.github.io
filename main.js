document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы формы
    const foodItemRadios = document.querySelectorAll('input[name="foodItem"]');
    const quantityInput = document.getElementById('quantity');
    const sausageOptionsGroup = document.getElementById('sausageOptionsGroup');
    const carrotOptionSelect = document.getElementById('carrotOption');
    const coffeePropertyGroup = document.getElementById('coffeePropertyGroup');
    const resultElement = document.getElementById('result');
    
    // Получаем все чекбоксы добавок для кофе
    const sugarCheckbox = document.getElementById('sugar');
    const cinnamonCheckbox = document.getElementById('cinnamon');
    const milkCheckbox = document.getElementById('milk');
    
    // Базовые цены для каждого товара
    const basePrices = {
        bun: 30,      // Булочка с маком (первый тип - без опций и свойств)
        sausage: 40,  // Сосиска в тесте (второй тип - только опции/селект)
        coffee: 50    // Кофе 0,3л (третий тип - только свойство/чекбоксы)
    };
    
    // Текущие значения
    let currentFoodItem = 'bun';
    let currentQuantity = 1;
    
    // Инициализация
    updateFormVisibility();
    calculateTotal();
    
    // Обработчики событий
    foodItemRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentFoodItem = this.value;
            updateFormVisibility();
            calculateTotal();
        });
    });
    
    quantityInput.addEventListener('input', function() {
        currentQuantity = parseInt(this.value) || 1;
        if (currentQuantity < 1) {
            currentQuantity = 1;
            this.value = 1;
        }
        if (currentQuantity > 5000) {
            currentQuantity = 5000;
            this.value = 5000;
        }
        calculateTotal();
    });
    
    // Обработчик для селекта морковки (второй тип товара - опции)
    carrotOptionSelect.addEventListener('change', calculateTotal);
    
    // Обработчики для чекбоксов кофе (третий тип товара - свойство)
    sugarCheckbox.addEventListener('change', calculateTotal);
    cinnamonCheckbox.addEventListener('change', calculateTotal);
    milkCheckbox.addEventListener('change', calculateTotal);
    
    // Функция для обновления видимости элементов формы
    function updateFormVisibility() {
        // Скрываем все дополнительные элементы
        sausageOptionsGroup.classList.add('hidden');
        coffeePropertyGroup.classList.add('hidden');
        
        // Сбрасываем значения при смене товара
        carrotOptionSelect.value = '0';
        sugarCheckbox.checked = false;
        cinnamonCheckbox.checked = false;
        milkCheckbox.checked = false;
        
        // Показываем нужные элементы в зависимости от выбранного товара
        switch(currentFoodItem) {
            case 'sausage': // Второй тип товара - только селект (опции)
                sausageOptionsGroup.classList.remove('hidden');
                break;
            case 'coffee': // Третий тип товара - только чекбоксы (свойство)
                coffeePropertyGroup.classList.remove('hidden');
                break;
            // Для 'bun' (первый тип) ничего не показываем
        }
    }
    
    // Функция для расчета общей стоимости
    function calculateTotal() {
        let basePrice = basePrices[currentFoodItem];
        let total = basePrice * currentQuantity;
        let calculationDetails = `${basePrice} руб × ${currentQuantity} шт`;
        
        // Для второго типа товара (сосиска) - добавляем стоимость из селекта (опции)
        if (currentFoodItem === 'sausage') {
            const carrotPrice = parseInt(carrotOptionSelect.value);
            if (carrotPrice > 0) {
                total += carrotPrice * currentQuantity;
                let optionText = '';
                switch(carrotPrice) {
                    case 20: optionText = 'стандартная порция'; break;
                    case 30: optionText = 'большая порция'; break;
                    case 15: optionText = 'маленькая порция'; break;
                }
                calculationDetails += ` + морковка (${optionText}, +${carrotPrice} руб/шт)`;
            }
        }
        
        // Для третьего типа товара (кофе) - добавляем стоимость чекбоксов (свойства)
        if (currentFoodItem === 'coffee') {
            let coffeeAdditions = 0;
            let additionsList = [];
            
            if (sugarCheckbox.checked) {
                const sugarPrice = parseInt(sugarCheckbox.value);
                coffeeAdditions += sugarPrice;
                additionsList.push(`сахар (+${sugarPrice} руб)`);
            }
            
            if (cinnamonCheckbox.checked) {
                const cinnamonPrice = parseInt(cinnamonCheckbox.value);
                coffeeAdditions += cinnamonPrice;
                additionsList.push(`корица (+${cinnamonPrice} руб)`);
            }
            
            if (milkCheckbox.checked) {
                const milkPrice = parseInt(milkCheckbox.value);
                coffeeAdditions += milkPrice;
                additionsList.push(`молоко (+${milkPrice} руб)`);
            }
            
            if (coffeeAdditions > 0) {
                total += coffeeAdditions * currentQuantity;
                calculationDetails += ` + добавки (${additionsList.join(', ')})`;
            }
        }
        
        // Обновляем отображение результата
        resultElement.innerHTML = `
            <div>Общая стоимость: <strong>${total} руб</strong></div>
            <div style="font-size: 14px; margin-top: 10px; color: rgba(255,255,255,0.9)">
                ${calculationDetails}
            </div>
        `;
    }
});