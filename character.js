// パーツ取得
const face = document.querySelector(".face");
const eyes = document.querySelector(".eyes");
const hair = document.querySelector(".hair");
const fronthair = document.querySelector(".fronthair");
const body = document.querySelector(".body");

// ========================
// 目の追従
// ========================

document.addEventListener("mousemove", (e) => {

    const frame = document.getElementById("avatar-frame");
    const rect = frame.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const moveX = Math.max(-4, Math.min(4, dx * 0.01));
    const moveY = Math.max(-2, Math.min(2, dy * 0.01));

    eyes.style.transform =
        `translate(${moveX}px, ${moveY}px)`;
});

// ========================
// 顔のゆらゆら
// ========================

let faceAngle = 0;

setInterval(() => {

    faceAngle += 0.05;

    const moveX = Math.sin(faceAngle) * 2;
    const moveY = Math.cos(faceAngle * 0.8) * 1.5;

    face.style.transform =
        `translate(${moveX}px, ${moveY}px)`;

}, 50);


// ========================
// 後ろ髪ゆらゆら
// ========================

let hairAngle = 0;

setInterval(() => {

    hairAngle += 0.1;

    hair.style.transform =
        `rotate(${Math.sin(hairAngle) * 2}deg)`;

}, 50);

// ========================
// 前髪ゆらゆら
// ========================

let frontHairAngle = 0;

setInterval(() => {

    frontHairAngle += 0.12;

    fronthair.style.transform =
        `rotate(${Math.sin(frontHairAngle) * 1.5}deg)`;

}, 50);

// ========================
// 体の上下ゆらゆら
// ========================

let bodyFloat = 0;

setInterval(() => {

    bodyFloat += 0.05;

    const moveY = Math.sin(bodyFloat) * 3;

    body.style.transform =
        `translateY(${moveY}px)`;

}, 50);

// ========================
// 瞬き
// ========================

function blink() {

    eyes.style.opacity = "0";

    setTimeout(() => {
        eyes.style.opacity = "1";
    }, 120);
}

setInterval(() => {

    const randomTime =
        3000 + Math.random() * 4000;

    setTimeout(blink, randomTime);

}, 7000);

const lights = document.querySelectorAll(".light");

function flicker() {

    // 0～2のどれか1つを選ぶ
    const light = lights[Math.floor(Math.random() * lights.length)];

    light.style.opacity = "1";

    setTimeout(() => {
        light.style.opacity = "0";
    }, 80);

    setTimeout(flicker, Math.random() * 1000 + 300);
}

flicker();