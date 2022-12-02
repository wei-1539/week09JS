// 請代入自己的網址路徑
const api_path = "rio00";
const token = "zFH3XI3cmUYvMGPE2alRfmxpFFj2";

// 預設網頁最先載入的函示
function init() {
    getProductList()
    getCartList()
}
init()

// DOM 選取
const productWrap = document.querySelector(".productWrap");
// console.log(productWrap)

// 資料初始化
let productData = []

// 取得 API 資料
function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
        .then(function (response) {
            // console.log(response.data)
            // 將API裡的資料 加入到資料初始化裡
            productData = response.data.products
            renderProductList()
        })
        .catch(function (error) {
            console.log(error.response.data)
        })
}

function renderProductList() {
    let str = ``;
    productData.forEach((item) => {
        str += `
        <li class="productCard" data-category=${item.category
            }>
            <h4 class="productType">新品</h4>
            <img src=${item.images} alt="">
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>
        `
    })
    productWrap.innerHTML = str
}
// 篩選資料
const productSelect = document.querySelector(".productSelect")
productSelect.addEventListener("change", (e) => {
    changeList(e.target.value)
})
function changeList(change) {
    let str = ``
    productData.forEach(item => {
        if (change === "全部") {
            getProductList()
        } else if (change === item.category) {
            str += `
        <li class="productCard" data-category=${item.category
                }>
            <h4 class="productType">新品</h4>
            <img src=${item.images} alt="">
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>
        `
        }
    })
    productWrap.innerHTML = str
}

// 購取得購物車列表
// DOM 
const cartList = document.querySelector(".shoppingCart-table")
// console.log(cartList)

let cartData = []

function getCartList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(function (response) {
            console.log(response.data)
            cartData = response.data.carts;
            // 是否要顯示刪除全部按鈕
            if (cartData.length === 0) {
                // 隱藏全部購物車按鈕

            }
            // 顯示購物車列表

            let str = `
        <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
        </tr>
        `;
            cartData.forEach(item => {
                str += `
            <tr>
                <td>
                    <div class="cardItem-title" >
                        <img src=${item.product.images} alt="">
                        <p>Antony ${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>NT$${(item.product.price) * (item.quantity)}</td>
                <td class="discardBtn" >
                    <a href="#" class="material-icons" data-id=${item.id}>
                        clear
                    </a>
                </td>
            </tr>
            `
            })
            str += `
        <tr>
            <td>
                <a href="#shoppingCart" class="discardAllBtn" >刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
                <p>總金額</p>
            </td>
            <td>NT$${response.data.finalTotal}</td>
        </tr>
        `
            cartList.innerHTML = str
        })
        .catch(function (error) {
            console.log(error.response.data)
        })
}

// 加入購物車
productWrap.addEventListener("click", function (e) {
    e.preventDefault()
    const addCartClass = e.target.getAttribute("class")
    if (addCartClass !== "addCardBtn") {
        console.log("請點加入購物車按鈕");
        return;
    }
    const productID = e.target.getAttribute("data-id")
    addCartItem(productID)
    // console.log(productID)
})

function addCartItem(id) {
    let num = 1;
    cartData.forEach(item => {
        if (item.product.id === id) {
            num++
        }
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
        data: {
            "productId": id,
            "quantity": num
        }
    })
        .then(function (response) {
            alert("成功加入購物車")
            getCartList()
        })

}

// 刪除購物車內特定產品
function deleteCartList(cartId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
        .then(function (response) {
            alert(`已刪除這項商品`);
            getCartList();
        })
}
cartList.addEventListener('click', (e) => {
    e.preventDefault();
    let cartID = e.target.getAttribute('data-id')
    console.log(cartID)
    if (cartID === null) {
        console.log("請點叉叉才能刪除")
        return
    }

    deleteCartList(cartID)

})

// 清除全部購物車

function deleteAllCartList() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(function (response) {
            alert("全部購物車刪除成功")
            getCartList()
        })
        .catch(function (response) {
            alert("購物車已清空，請勿重複點擊！")
        })
}
cartList.addEventListener("click", (e) => {
    const deleteAllBtn = e.target.getAttribute("class")
    if (deleteAllBtn !== "discardAllBtn") {
        console.log("想刪除全部請按 刪除所有項目");
        return
    }
    deleteAllCartList()
})

// 送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn")
orderInfoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("你被典籍了")
    if (cartData.length === 0) {
        alert("請加入購物車");
        return;
    }
    const customerName = document.querySelector("#customerName").value;
    const customerPhone = document.querySelector("#customerPhone").value;
    const customerEmail = document.querySelector("#customerEmail").value;
    const customerAddress = document.querySelector("#customerAddress").value;
    const tradeWay = document.querySelector("#tradeWay").value;
    console.log(customerName, customerPhone, customerEmail, customerAddress, tradeWay)
    if (customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || tradeWay == "") {
        alert("請輸入訂單資訊");
        return;
    }

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
        "data": {
            "user": {
                "name": customerName,
                "tel": customerPhone,
                "email": customerEmail,
                "address": customerAddress,
                "payment": tradeWay
            }
        }
    })
        .then((res) => {
            alert("訂單建立成功囉~")
            document.querySelector("#customerName").value="";
            document.querySelector("#customerPhone").value="";
            document.querySelector("#customerEmail").value="";
            document.querySelector("#customerAddress").value="";
            document.querySelector("#tradeWay").value="ATM";
        
            getCartList()
        })
})