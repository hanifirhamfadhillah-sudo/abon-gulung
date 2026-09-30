/* =========================
   MIDWAY ABON GULUNG
========================= */

const PRODUCT = {
    name: "Abon Gulung Khas Papua",
    price: 35000,
    image: "images/abon-gulung.jpg"
};

let productQuantity = 1;

let cart =
    JSON.parse(
        localStorage.getItem("midwayCart")
    ) || [];


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(number);

}


/* =========================
   PRODUCT QUANTITY
========================= */

function changeProductQuantity(amount) {

    productQuantity += amount;

    if (productQuantity < 1) {
        productQuantity = 1;
    }

    document.getElementById(
        "productQuantity"
    ).textContent = productQuantity;

}


/* =========================
   ADD PRODUCT
========================= */

function addProductToCart() {

    const existing =
        cart.find(
            item =>
                item.name === PRODUCT.name
        );


    if (existing) {

        existing.quantity +=
            productQuantity;

    } else {

        cart.push({

            name: PRODUCT.name,

            price: PRODUCT.price,

            image: PRODUCT.image,

            quantity: productQuantity

        });

    }


    saveCart();

    updateCart();

    showToast(
        "Abon Gulung ditambahkan ke keranjang"
    );


    productQuantity = 1;

    document.getElementById(
        "productQuantity"
    ).textContent = 1;

}


/* =========================
   SAVE CART
========================= */

function saveCart() {

    localStorage.setItem(
        "midwayCart",
        JSON.stringify(cart)
    );

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const count =
        document.getElementById(
            "cartCount"
        );

    const items =
        document.getElementById(
            "cartItems"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    let totalQuantity = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        totalQuantity +=
            item.quantity;

        totalPrice +=
            item.price *
            item.quantity;

    });


    count.textContent =
        totalQuantity;


    totalElement.textContent =
        formatRupiah(totalPrice);


    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatRupiah(totalPrice);

    }


    if (cart.length === 0) {

        items.innerHTML = `

            <div class="empty-cart">

                <p>
                    Keranjang masih kosong.
                </p>

            </div>

        `;

        return;

    }


    items.innerHTML =
        cart.map(
            (item, index) => `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div>

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${formatRupiah(item.price)}
                        </p>

                        <div
                            class="quantity-controls">

                            <button
                                onclick="changeCartQuantity(
                                    ${index},
                                    -1
                                )">

                                −

                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeCartQuantity(
                                    ${index},
                                    1
                                )">

                                +

                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-item"
                        onclick="removeFromCart(${index})">

                        Hapus

                    </button>

                </div>

            `
        ).join("");

}


/* =========================
   CHANGE CART QUANTITY
========================= */

function changeCartQuantity(
    index,
    amount
) {

    cart[index].quantity += amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}


/* =========================
   REMOVE
========================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

    showToast(
        "Produk dihapus dari keranjang"
    );

}


/* =========================
   OPEN CART
========================= */

function openCart() {

    document
        .getElementById("cartDrawer")
        .classList.add("active");

    document
        .getElementById("cartOverlay")
        .classList.add("active");

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    document
        .getElementById("cartDrawer")
        .classList.remove("active");

    document
        .getElementById("cartOverlay")
        .classList.remove("active");

}


/* =========================
   OPEN CHECKOUT
========================= */

function openCheckout() {

    if (cart.length === 0) {

        showToast(
            "Keranjang masih kosong"
        );

        return;

    }


    closeCart();

    updateCart();


    document
        .getElementById("checkoutModal")
        .classList.add("active");

}


/* =========================
   CLOSE CHECKOUT
========================= */

function closeCheckout() {

    document
        .getElementById("checkoutModal")
        .classList.remove("active");

}


/* =========================
   CHECKOUT
========================= */

document
    .getElementById("checkoutForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                showToast(
                    "Keranjang masih kosong"
                );

                return;

            }


            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


            const payment =
                document
                    .getElementById(
                        "paymentMethod"
                    )
                    .value;


            let total = 0;


            cart.forEach(item => {

                total +=
                    item.price *
                    item.quantity;

            });


            const orderId =
                "MID-" +
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                );


            const order = {

                id: orderId,

                name: name,

                phone: phone,

                address: address,

                payment: payment,

                total: total,

                items: cart,

                status:
                    "Pesanan dikonfirmasi",

                date:
                    new Date().toLocaleString(
                        "id-ID"
                    )

            };


            localStorage.setItem(
                "midwayOrder",
                JSON.stringify(order)
            );


            cart = [];

            saveCart();

            updateCart();


            document
                .getElementById(
                    "checkoutForm"
                )
                .reset();


            closeCheckout();


            showToast(
                "Pesanan berhasil dibuat"
            );


            setTimeout(
                function() {

                    const trackingInput =
                        document
                            .getElementById(
                                "trackingInput"
                            );


                    trackingInput.value =
                        orderId;


                    document
                        .getElementById(
                            "tracking"
                        )
                        .scrollIntoView({
                            behavior: "smooth"
                        });


                    setTimeout(
                        trackOrder,
                        500
                    );

                },
                800
            );

        }
    );


/* =========================
   TRACK ORDER
========================= */

function trackOrder() {

    const input =
        document
            .getElementById(
                "trackingInput"
            )
            .value
            .trim()
            .toUpperCase();


    const result =
        document
            .getElementById(
                "trackingResult"
            );


    if (!input) {

        showToast(
            "Masukkan nomor pesanan"
        );

        return;

    }


    /* DEMO ORDER */

    if (input === "MID-123456") {

        result.innerHTML = `

            <div class="tracking-status">

                <h3>
                    Pesanan MID-123456
                </h3>

                <p>
                    Produk:
                    <strong>
                        Abon Gulung Khas Papua
                    </strong>
                </p>

                <p>
                    Pembayaran:
                    <strong>
                        QRIS
                    </strong>
                </p>

                <div class="timeline">

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan dikonfirmasi

                    </div>

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan sedang diproses

                    </div>

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan dalam pengiriman

                    </div>

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan selesai

                    </div>

                </div>

            </div>

        `;

        return;

    }


    /* REAL ORDER */

    const savedOrder =
        JSON.parse(
            localStorage.getItem(
                "midwayOrder"
            )
        );


    if (
        savedOrder &&
        savedOrder.id === input
    ) {

        result.innerHTML = `

            <div class="tracking-status">

                <h3>
                    Pesanan ${savedOrder.id}
                </h3>

                <p>
                    Nama:
                    <strong>
                        ${savedOrder.name}
                    </strong>
                </p>

                <p>
                    Produk:
                    <strong>
                        Abon Gulung Khas Papua
                    </strong>
                </p>

                <p>
                    Pembayaran:
                    <strong>
                        ${savedOrder.payment}
                    </strong>
                </p>

                <p>
                    Total:
                    <strong>
                        ${formatRupiah(
                            savedOrder.total
                        )}
                    </strong>
                </p>

                <div class="timeline">

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan dikonfirmasi

                    </div>

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan sedang diproses

                    </div>

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan dalam pengiriman

                    </div>

                    <div class="timeline-item">

                        <span>✓</span>

                        Pesanan selesai

                    </div>

                </div>

            </div>

        `;

        return;

    }


    result.innerHTML = `

        <div class="tracking-status">

            <h3>
                Pesanan tidak ditemukan
            </h3>

            <p>
                Nomor pesanan
                <strong>
                    ${input}
                </strong>
                tidak ditemukan.
            </p>

        </div>

    `;

}


/* =========================
   VOUCHER
========================= */

function copyVoucher() {

    navigator.clipboard.writeText(
        "MIDWAY10"
    );

    showToast(
        "Kode MIDWAY10 berhasil disalin"
    );

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    document
        .getElementById("navMenu")
        .classList.toggle(
            "active"
        );

}


/* =========================
   CLOSE MENU
========================= */

document
    .querySelectorAll(
        ".nav-menu a"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                function() {

                    document
                        .getElementById(
                            "navMenu"
                        )
                        .classList.remove(
                            "active"
                        );

                }
            );

        }
    );


/* =========================
   CLOSE MODAL
========================= */

document
    .getElementById(
        "checkoutModal"
    )
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeCheckout();

            }

        }
    );


/* =========================
   INITIALIZE
========================= */

updateCart();