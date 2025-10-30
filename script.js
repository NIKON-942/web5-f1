document.addEventListener('DOMContentLoaded', () => {
    const savedMaxDigit = getCookie('maxDigit');

    if (savedMaxDigit) {
        const form = document.getElementById('maxDigitForm');
        form.style.display = 'none';

        alert(`Цифра з cookies: ${savedMaxDigit}. \nПісля натискання "ОК" дані будуть видалені.`);
        document.cookie = 'maxDigit=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

        alert('Cookies видалено. Натисніть "ОК" для перезавантаження.');

        location.reload();
    } else {
        document.getElementById('maxDigitForm').addEventListener('submit', maxDigitFormHandler);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'blockAlignments';
    
    const defaultAlignments = {
        'block2': 'center',
        'block4': 'center',
        'main_block': 'left'
    };

    const saved = JSON.parse(localStorage.getItem(storageKey));
    const alignments = { ...defaultAlignments, ...saved };
    localStorage.setItem(storageKey, JSON.stringify(alignments));
    for (const [blockId, alignment] of Object.entries(alignments)) {
        const block = document.getElementById(blockId);
        if (block) {
            block.style.textAlign = alignment;
        } else {
            console.warn(`Блок з ID "${blockId}" не знайдено.`);
        }
        
        const radioToSelect = document.querySelector(
        `.align-radio[data-block-id="${blockId}"][data-align-value="${alignment}"]`
        );
        if (radioToSelect) {
            radioToSelect.checked = true;
        } else {
            console.warn(`Радіо з ID "${blockId}" не знайдено.`);
        }
    }
    const allRadioButtons = document.querySelectorAll('.align-radio');
    allRadioButtons.forEach(radio => {
        radio.addEventListener('mouseout', (event) => {
            if (event.target.checked) {
                const blockId = event.target.dataset.blockId; 
                const alignment = event.target.dataset.alignValue;
                
                const blockToAlign = document.getElementById(blockId);
                if (blockToAlign) {
                    blockToAlign.style.textAlign = alignment;
                }

                alignments[blockId] = alignment;
                localStorage.setItem(storageKey, JSON.stringify(alignments));
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const allBlockIds = [
        'block1', 
        'block2', 
        'block3', 
        'block4', 
        'main_block',
        'block6', 
        'block7'
    ];
    allBlockIds.forEach(blockId => {
        const storageKey = 'list_' + blockId;
        const savedList = localStorage.getItem(storageKey);

        if (savedList) {
            try {
                const items = JSON.parse(savedList);
                const targetBlock = document.getElementById(blockId);

                if (targetBlock && items.length > 0) {
                    const list = document.createElement('ol');
                    list.classList.add('customList');
                    items.forEach(text => {
                        const li = document.createElement('li');
                        li.textContent = text;
                        list.append(li);
                    });
                    
                    targetBlock.append(list);
                }
            } catch (e) {
                console.error(`Помилка парсингу списку для ${blockId}:`, e);
            }
        }
    });

    const blockSelector = '#block1, #block2, #block3, #block4, #main_block, #block6, #block7';
    
    document.addEventListener('select', (event) => {
        const targetBlock = event.target.closest(blockSelector);
        if (!targetBlock || targetBlock.querySelector('.list_form')) {
            return;
        }

        const formContainer = document.createElement('div');
        formContainer.className = 'list_form';
        formContainer.style.marginTop = '15px';
        formContainer.style.border = '1px solid #007bff';
        formContainer.style.padding = '10px';
        formContainer.style.borderRadius = '5px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Новий пункт списку';

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.textContent = 'Додати';
        addButton.style.marginLeft = '5px';

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.textContent = 'Зберегти список';
        saveButton.style.marginLeft = '5px';

        addButton.addEventListener('click', () => {
            const text = input.value.trim();
            if (text === '') {
                return;
            }

            let list = targetBlock.querySelector('ol.customList');
            
            if (!list) {
                list = document.createElement('ol');
                list.classList.add('customList');
                formContainer.after(list);
            }

            const li = document.createElement('li');
            li.textContent = text;
            list.append(li);

            input.value = '';
            input.focus();
        });
        
        saveButton.addEventListener('click', () => {
            const items = [];
            const listItems = targetBlock.querySelectorAll('ol.customList li');
            
            listItems.forEach(li => {
                items.push(li.textContent);
            });

            if (items.length > 0) {
                const storageKey = 'list_' + targetBlock.id;
                localStorage.setItem(storageKey, JSON.stringify(items));
            } else {
                localStorage.removeItem('list_' + targetBlock.id);
            }

            formContainer.remove();
        });

        formContainer.append(input);
        formContainer.append(addButton);
        formContainer.append(saveButton);
        targetBlock.append(formContainer);
        input.focus();
    });
});

function swapBlocks() {
    let block3 = document.getElementById('block3');
    let block6 = document.getElementById('block6');

    let tempContent = block3.innerHTML;
    block3.innerHTML = block6.innerHTML;
    block6.innerHTML = tempContent;
}

const a = 8;
const h = 5;

function calcArea() {
    let block5 = document.getElementById('main_block');
    block5.innerHTML += ` Площа: ${a * h}`;
}

function maxDigitFormHandler(event) {
    event.preventDefault();
    let number = document.getElementById('numberWithMaxDigit').value;
    let maxDigit = Math.max(...number.split('').map(Number));
    alert(`Максимальна цифра: ${maxDigit}`);
    document.cookie = `maxDigit=${maxDigit}`;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return matches ? matches[1] : null;
}