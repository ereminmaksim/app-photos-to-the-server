import firebase from "firebase/app";
import "firebase/storage";
import {upload} from "./upload.js";
import * as url from "url";
 /**
  *  // './upload';импортирование файлов с собстваенной разработки (upload.js)
  */

 const firebaseConfig = {
  apiKey: "AIzaSyBQXYTS-xG1MFMmyucecn197Hd7XtFEP9c",
  authDomain: "front-end--by-eremin.firebaseapp.com",
  projectId: "front-end--by-eremin",
  storageBucket: "front-end--by-eremin.appspot.com",
  messagingSenderId: "417475649177",
  appId: "1:417475649177:web:1231f2204962526000a208",
  measurementId: "G-KXCSBNE1CB"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 // firebase.analytics();
 /*********************************************************************/

const storage = firebase.storage();
// console.log(storage)


 upload('#file', {
  multi: true,
  accept: ['.jpg','.jpeg','.gif','.png',],//попробовать добавить/расширить массив другими формами!!!
  //ниже функционал для отправления файлов на сервер (onUpload)
  onUpload(files, blocks) {
// console.log('files', files)
   files.forEach((file, index)=> {
    //передача файлов производится через ref!, там нужно кстаи ещё и прописать путь
    const ref = storage.ref(`images/${file.name}`)
    const task = ref.put(file)

    task.on('state_changed', snapshot => {
     // ниже просматривем загрузку на сервер, переводим байты (сколько байтов передано)
     const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
     // console.log(percentage)
     const block = blocks[index].querySelector('.preview-info-progress')
     //передаем с округлением
     block.textContent = percentage
     //добавим стили
     block.style.width = percentage
    }, error => {
     console.log('ERROR')
    }, () => {
     //получить ссылку на конкретную картинку
     task.snapshot.ref.getDownloadURL().then(url => {
      console.log('Download URL', url)
     })
     // console.log('Complete')
    })//прослушивание событий
   })
  }

 })
 // #file- это ID инпута!!!
 // multi - это ключ для получения доступа к добавлению нескольких фотографий для передачи на сервер,
 // найден при просмотре (target.files)!!!
 // accept - передача в  массиве файлов с определынными расширениями для передачи.
