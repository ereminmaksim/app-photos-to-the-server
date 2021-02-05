/**
 * приватая функция для перевода из байтов в мб!!!
 */

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return '0 Byte';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

/*********************************************************************/

/**
 * создание функции ХЭЛПЕР!!!(DOWNLOADS)
 */
const element = (tag, classes = [], content) => { // в себя приниммает HTML (DOM) отрисовку
 const node = document.createElement(tag)

    if(classes.length) {
        node.classList.add(...classes)// это передача не массива, а набор строк (...оператор "SPREAD")

    }else if (content){
        node.textContent = content

    }

    return node
}


/*********************************************************************/

/**
 * Функция заглушка для проверки файлов с ошибками для отправки на сервер, не нисёт за собой больших компетенций
 */
function noop() {}



/**
 * upload функция
 * @param selector
 */
export function upload(selector, options = {}) {

    //для отправки файлов на сервер
    /*********************************************************************/
    const onUpload = options.onUpload ?? noop





    //создание переменной с видимостью для других функций для дальнейшго удаления по крестику (любой файл)
    /*********************************************************************/
    let files = [];// наполнямый, удалямый пустой массив

    //для получения DOM лемента
    const input = document.querySelector(selector)//  selector это инпут!!!

    // создаём превью для картинок
    /*********************************************************************/

    /**
     * Так писали ранее
     * const preview = document.createElement('div');
     * preview.classList.add('preview');
     */
    const preview = element('div', ['preview']);
    // const preview = document.createElement('div');
    // preview.classList.add('preview');


    /**
     * const open = document.createElement('button')// создаём кнопку
     * open.classList.add('btn')// класс
     */
    //создаём кнопку
    /*********************************************************************/
    const open = element('button', ['btn'], 'Открыть')// создаём кнопку
    // const open = document.createElement('button')// создаём кнопку
    // open.classList.add('btn')// класс
    //вставили внутри input
    //создаём кнопку для DOWNLOAD
    /*********************************************************************/
    // ПО умолчанию мы её прячем, появляться она у нас будет после того как мы откроем картинки, после происходит тображение!!!
    const upload = element('button', ['btn','primary'], 'Загрузить')
    upload.style.display  = 'none'; //пока закрываем:))

    input.insertAdjacentElement("afterend", preview)// кнопка preview создаём после button
    input.insertAdjacentElement("afterend", upload)// кнопка download создаём после button
    input.insertAdjacentElement("afterend", open)//insertAdjacentElement
    // - позиция / - элемент / вставить элемент после, не путать с insertAdjacentHTML, производится работа именно с элементами!!!

    // создаём обёртку для кнопки тег Открыть!!!(span)
    /*********************************************************************/
    const spanBtn = document.createElement('span')// создаём обёртку для кнопки
    open.insertAdjacentElement("afterbegin", spanBtn);//insertAdjacentElement для обёртки
    spanBtn.textContent = "Открыть"//текст

    // создаём обёртку для кнопки тег Загрузить!!!(span)
    const spanBtn2 = document.createElement('span')
    upload.insertAdjacentElement("afterbegin", spanBtn2);
    spanBtn2.textContent = "Загрузить"//текст



    /**
     * Ниже условия для обработки, выбора нескольких фотографий для передачи на
     * сервер, при условии, что options.multi == true тогда вызываем
     * element.setAttribute(name, value); где:
     * name - имя атрибута (строка).
     * value  - значение атрибута.
     */
    if (options.multi) {
        input.setAttribute('multiple', true)
    }// получили доступ к расширению объекта!!!

    /**
     * Дать понять каое расширение файлов можно использовать
     * передача файлов с расширениями, также проверка является ли это массивом (Array.isArray)
     */
    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))//объединяем все элементы массива
        // (или массивоподобного объекта) в строку.
    }


    // создаём событие для кнопки открыть, при помощи (клика)
    /**
     * clickInput (функция)/тоесть при её вызовы отрабатывается событие по кнопку
     */
    const clickInput = () => input.click()
    //вызов

    /*********************************************************************/

    const changeHandler = event => {
        // console.log(!event.target.files)//росмотреть данные по любой картинке:)))
        /**
         * ВАЖНО!!! запись (!event.target.files.length)равносильна записи (!event.target.files.length === 0)
         * тоесть (FALSE), !- даёт само по себе отрицание:)))
         */
        if (!event.target.files.length) {
            return // если нет выбора файла, то и не надо выполнять никакой функционал
        }
        /**
         * preview.innerHTML = ' ' 'этой командой мы даём понять, что мы очищаем файлы и кажды последующий раз работаем
         * только с актуальными!!!каждый раз список обновляется
         */
        preview.innerHTML = ' '//только с актуальными!!!

        /*********************************************************************/
        files = Array.from(event.target.files)
        upload.style.display = 'inline'//как только картинки появились, мы можем открыть кнопку для Загрузки
        // так было до появления переменной (глобальной), для удалния картинок||| const files = Array.from(event.target.files)// приводим/переводим строковое значение к массиву
        // const {files} = event.target // запись равносильна  const files = event.target.files {}- обращение к ключу!!!
        console.log(Array.isArray(files))//-проверили массив ли это?
        files.forEach(file => {
            console.log(file)
            if (!file.type.match('image')) {// анным условием мы подстверждаем, что используем только картинки-ВАЖНО!!!
                return
            }
            /**
             * ДЕЛАЕМ ПРЕВЬЮ КАРТИНОК- просмотр перед отправкой на сервер!!!
             */
            const reader = new FileReader()//- FileReader библитека со своими методами, из под капота

            //условие!!! как только мы при помощи reader считаем файл
            reader.onload = ev => {
                const src = ev.target.result //путь до картинки!!!

                // console.log(ev.target.result)// мы получим/просмотрим кодировку изображения
                // проверочный
                // input.insertAdjacentHTML('afterend', `<img src="${ev.target.result}" alt="preview"/>`)

                preview.insertAdjacentHTML('afterbegin', `
<!--                заводим разметку-->
                <div class ="preview-image">
                <div class="preview-remove" data-name ="${file.name}">&times;</div>
<!--                наш крстик для удаления (&times;)-->
                    <img src="${src}" alt="${file.name}" />
                    <div class="preview-info">
                    <span>${file.name}</span>
                    ${bytesToSize(file.size)}
                    </div>
                </div>
                `)
            }

            reader.readAsDataURL(file)//асинхронная операция, делаем обработчик события выше|
        })

    }

    /**
     * ФУНКЦИЯ ДЕЛЕГИРОВНИЯ И ОТЛОВА СОБЫТИЙ ДЛЯ УДАЛЕНИЯ ЛИШНЕГО ФАЙЛА(ОВ)!!!
     */
    const removeHandler = event => {
        // console.log(event.target.dataset)
        if (!event.target.dataset.name) {
            return
        }

        const {name} = event.target.dataset;
        console.log(name)// это точное названи файла для удаления
        files = files.filter(file => file.name !== name)//  сейчас мы получили только массив, из которого можно удалить
        // сам файл, НО- он удалятся только из массива, а не из DOM

        /**
         *Делаем условие, -если у нас картинки удалены для просмотра, то мы прячем, опять кнопку (Загрузить)
         */
        if(!files.length){
            upload.style.display = 'none'
        }


        // вводим переменную для удаления картики из DOM`a
        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')
        // console.log(block)
        // можно удалить сразу, но, хотелось бы это сделать с анимацией
        // block.remove()

        block.classList.add('removing');
        setTimeout(() => block.remove(), 300)
        console.log(block)
        // block.remove()

    }

        const clearPreview = el => {
        el.style.bottom = '4px'
        el.innerHTML = `<div class = "preview-info-progress"></div>`
        }

    /**
     * Функция для загрузки картинок!!!
     */
    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())//перебор псвдомассива с удалением элементов
        const  previewInfo = preview.querySelectorAll('.preview-info')//статус загрузки
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)// то callback функция которую мы передавали в наш плагин
    }


    open.addEventListener('click', clickInput)
    //далее создаём новое событие для input (бработка входящих файлов для выбора)
    input.addEventListener('change', changeHandler)
    // ДЕЛГИРОВНИЕ И ОТЛОВ СОБЫТИЯ ДЛЯ УДАЛЕНИЯ ЛИШНЕГО ФАЙЛА(ОВ)!!!
    preview.addEventListener('click', removeHandler)
    // Загужаем файлы на сервер
    upload.addEventListener('click', uploadHandler)

}
/////////////////////////////!!!UI составление программы завершено!!!//////////////////////////////////////