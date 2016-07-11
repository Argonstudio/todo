//Ivan Voutkov, 2016    

        var tasks = document.getElementById('tasks');
        var form = document.getElementById('form');
            
        var openFormAdd = false;
        var errorMessageDisplay = false;
            
        //Функция создающая форму ввода имени задачи
        function createBlockAddName(addOrChange) {
                
                var formAddNameTask = document.createElement('div');
                formAddNameTask.id = "formAddNameTask"
                form.insertBefore(formAddNameTask,form.children[0]);
                
                if(addOrChange == "add") 
                { formAddNameTask.innerHTML = "<p></p> Название задачи:<p></p> <input type='text' id='enterNameTask'> <p></p> <input type='button' id='sendNameTask' value='добавить'> <input type='button' onclick='deleteBlockAddName()' value='отмена'>"; }
                else { formAddNameTask.innerHTML = "<p></p> Изменить задачу:<p></p> <input type='text' id='enterNameTask'> <p></p> <input type='button' id='sendNameTask' value='ок'> <input type='button' onclick='deleteBlockAddName()' value='отмена'>"; }
                
                
            }
            
        //Функция удаляющая форму
        function deleteBlockAddName() {
                
                var formAddNameTask = document.getElementById('formAddNameTask');
                
                formAddNameTask.parentNode.removeChild(formAddNameTask);
                openFormAdd = false;
                errorMessageDisplay = false;
            }
            
        //Вывод сообщения об ошибке ввода
        function inputError() {
                
                var formAddNameTask = document.getElementById('formAddNameTask');
                
                if(!errorMessageDisplay) {
                var error = document.createElement('div');
                error.className = "error";
                error.innerHTML = "Введите название!"
                
                formAddNameTask.appendChild(error);
                }
                
                errorMessageDisplay = true;
            }
            
            
        //Создание задачи
        function addTask() {
                
                if(!openFormAdd) {
                    
                    openFormAdd = true;
                    var task = document.createElement('div');
                    task.className = "task";
                    
                    var nameTask = document.createElement('div');
                    nameTask.className = "nameTaskClass";
                    nameTask.setAttribute('name', 'nameTask');
                    nameTask.innerHTML = "Название задачи: "
                    
                    task.insertBefore(nameTask,task.children[0]);
                    
                    
                    
                    createBlockAddName("add");
                    
                    function getNameTask() {
                        
                        
                        nameTask.innerHTML += "<b>" + document.getElementById('enterNameTask').value + "</b>";
                        
                        sortTasks(task);
                        addButtons();
                        
                    }
                    
                    function addButtons()
                    {
                        task.innerHTML += "<button class='tools' id='editButton' onclick='editTask(this)'>Изменить</button> <button class='tools' id='completeButton' onclick='completeTask(this)'>Выполнено</button> <button class='tools' id='deleteButton' onclick='deleteTask(this)'>Удалить</button>"
                        
                        addLocalStorage();
                        
                        deleteBlockAddName();
                    }
                    
                    //Проверяем заполнение формы
                    function inputValidation() {
                        
                        
                        if(document.getElementById('enterNameTask').value == '') inputError();
                        else getNameTask()
                    }
                    
                    
                    sendNameTask.onclick = inputValidation;
                    
                }else deleteBlockAddName();
            }
            
        //Функция записи задач в локальное хранилище
        function addLocalStorage() {
               
               
                var pageOpenedBefore = localStorage.getItem("pageOpenedBefore");
                
                localStorage.clear(); // Чистит хранилище. 
                // Можно убрать, заметной потери функциональности не будет, это просто удаление не используемых значений
                // Используется по причине отсуствия других записей в локальное хранилище не связанных с данным скриптом
                
                localStorage.setItem("pageOpenedBefore",pageOpenedBefore);
                
                //Колличество задач
                var amountTasks = tasks.children.length;
                
                //Записываем задачи
                for(var i = 0; i < amountTasks; i++)
                {
                    localStorage.setItem(i,tasks.children[i].innerHTML);
                    localStorage.setItem(i+"opacity",tasks.children[i].style.opacity);
                }
                
                
                localStorage.setItem("amountTasks",amountTasks);
            }
           
        //Функция сортировки 
        function sortTasks(task) {
               var task = task;
               
               //Проверяем есть ли уже задачи, если есть, сравниваем с ними новую
               if(tasks.children[0] ) {
                   
                   var listNames = document.getElementsByName('nameTask');
                   
                   
                   var arr = [];
                   var counter = 0;
                   var elementInArray = false;
                   
                   //Собираем все имена задач в массив
                    for(var i = 0; i < listNames.length; i++)
                    {
                        arr[i] = listNames[i].querySelector('b').innerHTML;
                        counter++;
                        if(listNames[i].querySelector('b').innerHTML == task.childNodes[0].querySelector('b').innerHTML) elementInArray = true;
                    }
                    
                    var numbersElements = listNames.length-1;
                    
                    if(!elementInArray) {
                        arr[counter] = task.childNodes[0].querySelector('b').innerHTML;
                        var numbersElements = listNames.length;
                    }
                    
                    arr.sort();//Сортируем массив
                   
                   //Делаем массив с обратной сортировкой 
                   var arrReverse = arr.reverse();
                    
                    var placeInArrayNewName;
                    
                    //Ищем расположение в массиве имени новой задачи
                    for(var i = 0; i < arrReverse.length; i++)
                    {
                        if(arrReverse[i] == task.childNodes[0].querySelector('b').innerHTML) placeInArrayNewName = i;
                    }
                    
                    tasks.insertBefore(task,tasks.children[placeInArrayNewName])
                    
                    
               }else tasks.insertBefore(task,tasks.children[0]); 
           }
           
          
           
        //Функция удаления задачи
        function deleteTask(linkToTheButton) {
                var linkToTheButton = linkToTheButton;
                linkToTheButton.parentNode.parentNode.removeChild(linkToTheButton.parentNode);
                addLocalStorage();
            }
            
        //Функция редактирования задачи
        function editTask(linkToTheButton) {
                
                if(!openFormAdd) {
                    
                    openFormAdd = true;
                
                    var linkToTheButton = linkToTheButton;
                    createBlockAddName();
                    
                    
                    function getNameTask() {
                        
                        linkToTheButton.parentNode.querySelector('b').innerHTML = document.getElementById('enterNameTask').value;
                        sortTasks(linkToTheButton.parentNode);
                        addLocalStorage();
                        
                        deleteBlockAddName();
                        
                        
                    }
                    
                    function inputValidation() {
                            
                            
                            if(document.getElementById('enterNameTask').value == '') inputError();
                            else getNameTask()
                        }
                    
                    
                    sendNameTask.onclick = inputValidation;
                    
                } else deleteBlockAddName();
            }
            
        //Функция отмечающая задачу как выполненную или невыполненную
        function completeTask(linkToTheButton) {
                
                var linkToTheButton = linkToTheButton;
                
                if(linkToTheButton.parentNode.style.opacity != "0.5") {
                    linkToTheButton.parentNode.style.opacity = "0.5";
                    linkToTheButton.innerHTML = "Активировать";
                }
                else {
                    linkToTheButton.parentNode.style.opacity = "";
                    linkToTheButton.innerHTML = "Выполнено"
                }
                
                addLocalStorage();
                
            }
        
        //Показываем примерные задачи при первой загрузке
        function showSampleTasks() {
            
                if( localStorage.getItem("pageOpenedBefore") != 1) {
                    
                    for(var i = 1; i <= 3; i++)
                    {
                    var exampleTask = document.createElement('div');
                    exampleTask.className = "task";
                    exampleTask.innerHTML = "<div class='nameTaskClass' name='nameTask'>Название задачи: <b>" + i + "</b></div><button class='tools' id='editButton' onclick='editTask(this)'>Изменить</button> <button class='tools' id='completeButton' onclick='completeTask(this)'>Выполнено</button> <button class='tools' id='deleteButton' onclick='deleteTask(this)'>Удалить</button>";
                    
                    tasks.insertBefore(exampleTask,tasks.children[0])
                    
                    }
                    
                }
                
                localStorage.setItem("pageOpenedBefore",1);
                addLocalStorage();
        }
        
            
        //Функция восстанавливающая задачи
        function recoveryFromLocalStorage() {
                
                //Восстанавливаем задачи из хранилища
                var amountTasks = localStorage.getItem('amountTasks')
                for(var i = amountTasks-1; i >= 0; i--)
                {
                    
                    var recoveryTask = document.createElement('div');
                    
                    recoveryTask.className = "task";
                    recoveryTask.innerHTML = localStorage.getItem(i);
                    recoveryTask.style.opacity = localStorage.getItem(i+"opacity");
                    
                    
                    tasks.insertBefore(recoveryTask,tasks.children[0])
                    
                }
                
            }
        
        recoveryFromLocalStorage();
        showSampleTasks();
        
