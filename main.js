// * düzenleme seçenekleri
let editFlag = false; //* düzenleme modunda olup olmadığını belirtir.
let editElement; //*düzenleme yapılan öğeyi temsil eder.
let editID; //* düzenleme yapılan öğenin benzersiz idsi

//* Gerekli HTML elementlerini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
// console.log(clearBtn);

// ! Fonksiyonlar

// *Ekrana bildirim bastıracak fonksiyondur.
const displayAlert = (text, action) => {
  alert.textContent = text; //*alert classlı etiketin içerisine dışarıdan gönderilen parametre ile değiştirdik.
  alert.classList.add(`alert-${action}`); //*p etiketine dinamil class ekledik.

  setTimeout(() => {
    alert.textContent = ""; //eklediğimiz texti boş stringe çevirdik.
    alert.classList.remove(`alert-${action}`); //eklediğimiz classı çıkartıyoruz.
  }, 2500); //3000ms 2 s denk geliyor
};
// varsayılan değerlere dönderir
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
  clearBtn.style.display = "grid";
};

const addItem = (e) => {
  e.preventDefault(); //formun gönderilme olayında sayfanın yenilenmesini engeller.
  const value = grocery.value; // ınput içerisine girilen değeri aldık.
  const id = new Date().getTime().toString(); //*Benzersiz bir id oluşturduk.

  //* Eğer inputun içerisi boş değilse ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* Yeni bir "article" öğesi oluştur.
    let attr = document.createAttribute("data-id"); //* yeni bir veri kimliği oluştur.
    attr.value = id; //*attr id değeri atanarak her article farklı id verilmiş oluyor.
    element.setAttributeNode(attr); //* oluşturduğumuz attributeyi article içerisine classList gibi ekledik.
    element.classList.add("grocery-item"); //*artice etiketine class ekledik.
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
        </div> 
    `;
    /* butonlarla düzenle ve silme işlemi yapacağımızdan dolayı içeride ulaşmamız lazım innerHtml içinde oluğu için*/
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem); //fonskiyonu tanımlanır.
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem); //fonskiyonu tanımlanır.

    list.appendChild(element); //*article etiketini html ekledik.
    // console.log(element);
    displayAlert("Başarıyla Eklendi", "success");

    // *varsayılan değerlere döndürme
    setBackToDefault();
    addToLocalStorage(id, value);
  } else if (value != "" && editFlag) {
    editElement.innerHTML = value; //*güncellenecek elemanın içeriğini değiştirme
    displayAlert("Başarıyla Güncellendi", "success");
    editLocalStorage(editID, value); // editLocalStorage doğru şekilde çağrılıyor
    setBackToDefault();
  } else {
    displayAlert("Lütfen Boş bırakmayınız!", "danger");
  }
};

// *silme butonuna tıklanıldığında çalışır
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement; //sileceğimiz etikete kapsayıcıları yardımıyla ulaştık.
  const id = element.dataset.id;
  list.removeChild(element); //bulduğumuz article etiketini sildik
  displayAlert("Başarıyla Kaldırıldı.", "danger"); // ekrana gönderdiğimiz parametrelere göre bildirim basma
  console.log(element);

  removeFromLocalStorage(id);
};

const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSibling; //* düzenleme yapacağımız etiketi seçtik
  grocery.value = editElement.innerHTML; //*düzenlediğimiz etiketin içeriğini inputa aktardık.
  editFlag = true;
  editID = element.dataset.id; //*değişiklik yapacağımız data-idyi dataset ile tespit edip editID değişkenine atanarak onun üzerinde işlem yapılır.
  submitBtn.textContent = "Düzenle"; //*düzenle butonuna tıklandığında ekle butonu düzenle olarak değişsin.
  console.log(editElement);
};

// tüm içeriği temizleme
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //   console.log(items);
  //listede article etiketi var mı
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item); //*forEach ile her bir eleman dönülerek liste temizlendi.
    });
  }
  clearBtn.style.display = "none"; //listeyi temizle butonunu ekrandan kaldırdık.
  displayAlert("Liste Temizlendi.", "danger"); // liste temizleme
  localStorage.removeItem("list");
};

// yerel depodan öğeleri ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = {
    //id: id, value: value };
    id,
    value, //isimler aynı ise birini yazmamız yeterli.
  };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

// yerel depodan öğeleri alma işlemi
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// local storage id göre silme
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id == id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};
// local storage yenilenince ekrana yazdırma
const createListItem = (id, value) => {
  //* gönderilen ıd ve değere sahip bir öge oluşturan fonksiyon
  const element = document.createElement("article"); //* Yeni bir "article" öğesi oluştur.
  let attr = document.createAttribute("data-id"); //* yeni bir veri kimliği oluştur.
  attr.value = id; //*attr id değeri atanarak her article farklı id verilmiş oluyor.
  element.setAttributeNode(attr); //* oluşturduğumuz attributeyi article içerisine classList gibi ekledik.
  element.classList.add("grocery-item"); //*artice etiketine class ekledik.
  element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
        </div> 
    `;
  /* butonlarla düzenle ve silme işlemi yapacağımızdan dolayı içeride ulaşmamız lazım innerHtml içinde oluğu için*/
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem); //fonskiyonu tanımlanır.
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem); //fonskiyonu tanımlanır.

  list.appendChild(element); //*article etiketini html ekledik.
};
// itemleri local storage gönderme
const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};

// ! olay izleyicileri

// * form gönderildiğinde addItem fonksiyonu çalışır.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
