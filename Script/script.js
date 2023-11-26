const myCard = document.getElementById("navButton");
const body = document.getElementById("body");
const sideBarContent = document.getElementById("sidebarContentContainer");
//
//
// verileri side bar a almadan önce boş bir arraye aktarmak için
const myCardData = [];
//
//

//
//
//
//
// arayimin içinde eleman var mı yok mu control eder eğer varsa mycard butonunun rengini değiştirir yoksa aynı halinde kalır
const ifMyCardData = () => {
  if (myCardData.length === 0) {
    myCard.classList.remove("loaded");
  } else {
    myCard.classList.add("loaded");
  }
};
//
//
//
//
// Add buttonuna tıklandığında çalışacak function
const addMore = async (userId) => {
  const myCardDataAdd = myCardData.find(function (myCardDataUser) {
    return myCardDataUser.id === userId;
  });
  console.log(myCardDataAdd.price);
  // eğer veri varsa amount u 1 arttır
  if (myCardDataAdd) {
    myCardDataAdd.amount += 1;
    const apiData = await ApiRequest();
    const apiFind = apiData.find(function (user) {
      return user.id === userId;
    });
    myCardDataAdd.price += apiFind.price;
    // array i güncelle
    console.log("Sayısı artan Eleman: ", myCardDataAdd);
    myCardDataHtml();
  }
};
//
//
//
const subtract = async (userId, event) => {
  const count = event.target.previousElementSibling;
  const myCardDataSubtract = myCardData.find(function (myCardDataUser) {
    return myCardDataUser.id === userId;
  });
  if (count.innerText == 1) {
    count.classList.add("active");
    return;
  }
  if (myCardDataSubtract) {
    myCardDataSubtract.amount -= 1;
    const apiData = await ApiRequest();
    const apiFind = apiData.find(function (user) {
      return user.id === userId;
    });
    myCardDataSubtract.price -= apiFind.price;

    myCardDataHtml();
    console.log("Sayısı eksilen Eleman:", myCardDataSubtract);
  }
};
//
//
//
// Remove buttonuna tıklandığında çalışacak function
const remove = (userId) => {
  // işlem yapabilmek için find'den gelen index numaralarını aktarıcağım boş bir değer
  let globalIndex;
  //
  const myCardDataR = myCardData.find(function (cardElement, index) {
    if (cardElement.id === userId) {
      // oluşturduğum boş verinin içerisine indexi aktarıyorum
      globalIndex = index;
      //
      return cardElement;
    }
  });
  console.log("Silinen eleman: ", myCardDataR);
  // seçilen elemanın index'ine göre elemanı array den kaldır
  myCardData.splice(globalIndex, 1);
  // array i güncelle

  myCardDataHtml();
};
//
//
//
//
//
// side bar için oluşturulan html dökümanı fonksiyonu
const myCardDataHtml = () => {
  ifMyCardData();
  sideBarContent.innerHTML = "";
  myCardData.forEach((user) => {
    sideBarContent.innerHTML += `
    <li class = "sidebar-content">
        <span class = "sidebar-content-h1">${user.name}</span>
        <img src = "${user.banner}">
        <span class = "sidebar-price">${user.price}$</span>
      <div class = "side-bottom">
      <div class = "add-subtract">
      <button class="add-more" onclick="addMore(${user.id})">+</button>
         <span id = "count" class = "count">${user.amount}</span>
         <button class = "subtract" onclick = subtract(${user.id},event)>-</button>
      </div>
        <button class = "remove" onclick = remove(${user.id})>Remove</button>
      </div>
    </li>
  `;
    return sideBarContent;
  });
};
//
//
//
//
//
//
//
// navbar'daki mycard butonuna tıklandığında
myCard.onclick = () => {
  const sideBarNav = document.getElementById("sideBarNav");
  sideBarNav.classList.toggle("active");
  body.classList.toggle("active");
};
//
//
//
//
//
//
//
// API'daki verilerime istek yapan bi function
const ApiRequest = async () => {
  const request = await fetch("./backend_data/product.json");
  const response = await request.json();
  return response;
};
//
//
//
// ekran yüklendiğinde çalışacak fonksiyon
window.onload = async () => {
  const apiData = await ApiRequest();
  console.log("ApiData:", apiData);
  apiData.forEach((element) => {
    //
    //
    //
    // gelen verilerimi div e yazdır
    const apiElement = document.createElement("div");
    apiElement.classList.add("api-element");
    apiElement.id = "apiElement";
    apiElement.innerHTML += `
    <span class= "api-h1">${element.name}</span>
    <img src ="${element.banner}">
    <span class = "api-p1">${element.description}</span>
    <span class = "price">${element.price}$</span>
    `;
    //
    //
    //
    //
    // gelen verilere birde button ekle
    const liButton = document.createElement("button");
    liButton.classList.add("button");
    liButton.id = "btn";
    liButton.innerHTML += `
    <span>Add to cart</span>
      <div class="cart">
          <svg viewBox="0 0 36 26">
              <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5"></polyline>
              <polyline points="15 13.5 17 15.5 22 10.5"></polyline>
          </svg>
      </div>
    `;
    //
    //
    //
    //
    //ilk başta tıklanabilir olan4 3.7 saniye sonra çalışması için varsayılan bir true değeri
    let canClick = true;
    // o button onclick olduğunda
    liButton.onclick = async function () {
      // animasyon için olan kodlar
      if (!liButton.classList.contains("loading")) {
        liButton.classList.add("loading");
        setTimeout(() => liButton.classList.remove("loading"), 3700);
      }
      //eğer canClik varsa tıklanılamaz yap
      if (canClick) {
        canClick = false;
        // 3.7 saniye sonra tekrardan tıklanabilir hale getir
        setTimeout(() => {
          canClick = true;
        }, 3700);
        //
        // api a 2. istek yapıldı
        const apiData2 = await ApiRequest();
        // 2. istekten gelen verilerden bana tıklananın id sini getir
        const getMainData = apiData2.find((product) => {
          return product.id === element.id;
        });
        // arrayimde id si tıklanan elementin id sine eşit olanı getir
        const getData = myCardData.find((urunlerim) => {
          return urunlerim.id === element.id;
        });

        // eğer aynı veriden varsa amount'a 1 ekle
        if (getData) {
          getData.amount += 1;
          getData.price += getMainData.price;
          // yoksa gelen veriyi boş arrayime push la ve amount diye bir değer oluştur o değere 1 ver
        } else {
          getMainData.amount = 1;
          myCardData.push(getMainData);
        }

        console.log("Side bar array'ine aktarılan elemanlar:", myCardData);
        sideBarContent.innerHTML = "";
        myCardDataHtml();
        //
        //
      }
    };
    //
    //
    //
    //
    //button u div e at
    apiElement.append(liButton);
    // div i body'ye at
    //
    //
    //
    body.append(apiElement);
  });
};
