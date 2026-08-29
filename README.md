# Kashidakari — Website (Chowk, Lucknow)

Chikankari clothing shop ki poori website: frontend + backend, saath mein online order form.

## Isme kya kya hai
- `public/index.html` — Homepage (Hero, Collection, Craft story, Gallery, Order form, Contact/Map)
- `public/css/style.css` — Poora design
- `public/js/script.js` — Order list, form submit, WhatsApp order link
- `public/admin.html` — **Aapke liye**: sab aaye hue orders yahan dikhenge → `http://localhost:3000/admin.html`
- `server.js` — Backend (Node.js + Express) — orders `data/orders.json` mein save hote hain
- `data/orders.json` — Sabhi orders yahan save hote hain (dukaan ka record)
- `data/messages.json` — Contact form ke messages

## Chalane ka tareeka (apne computer par)

1. [Node.js](https://nodejs.org) install karein (agar pehle se nahi hai) — LTS version lein.
2. Terminal / Command Prompt kholein, is folder mein jaayein:
   ```
   cd kashidakari
   npm install
   npm start
   ```
3. Browser mein kholein: **http://localhost:3000**
4. Orders dekhne ke liye: **http://localhost:3000/admin.html**

## WhatsApp Number

Aapka number (+91 93359 02489) already site mein set ho chuka hai — header ka WhatsApp button, Visit section, aur order form ka "WhatsApp par bhejein" button, sab isi number par jaate hain. Number badalna ho toh `public/js/script.js` mein `SHOP_WHATSAPP_NUMBER` aur `public/index.html` mein `919335902489` dhoondh kar update kar dein.

## Apni photos lagana

Abhi site mein free stock (Pexels) ki chikankari photos lagi hain taaki site turant achi dikhe. Jab aapke paas apni dukaan/products ki real photos ho jaayein:

1. Photo ko kahin bhi upload karein (jaise Google Drive/Imgur se link le lein, ya seedha `public/images/` folder banakar file daal dein).
2. `index.html` mein jahan bhi `<img src="https://images.pexels.com/...">` dikhe, us `src=""` ke andar apni photo ka link/path daal dein.

## Online daalna (dukaan ke liye live website)

Ye site kisi bhi Node.js hosting par chal jaayegi — jaise Render.com, Railway.app, ya Hostinger jaisi Indian hosting (jo Node support kare). Agar madad chahiye hosting mein, bata dein.

## Rate/Price

Chikankari ke rate roz thoda upar-neeche hote hain, isliye site mein fix price nahi rakhi — customer WhatsApp/call karke rate confirm karta hai. Agar aap chahte hain ki fix price list dikhe, bata dein — wo bhi add kar dunga.
