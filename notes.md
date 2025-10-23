# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

## Helpful links

cheese

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```

# Web Dev Cheat Sheet (HTML, CSS, JS, Console, DNS)

## HTML Basics
- `<link>` → Connects external resource (usually CSS).  
  Example: `<link rel="stylesheet" href="style.css">`
- `<div>` → Block-level container for grouping content.
- `<span>` → Inline container for styling text (`display: inline` by default).
- **Basic tags**
  - Paragraph → `<p>`
  - Ordered list → `<ol>`
  - Unordered list → `<ul>`
  - Headings → `<h1>`, `<h2>`, `<h3>`, etc.
- **Declare HTML doc type:** `<!DOCTYPE html>`
- **Image hyperlink:**
  ```html
  <a href="https://example.com"><img src="pic.jpg" alt="Example"></a>
  ```

---

## CSS Basics
- `#id` → Select by ID (`#title`)
- `.class` → Select by class (`.grid`)
- Example: `div { background-color: red; }` → All divs red
- **Padding vs Margin**
  - Padding = space *inside* border (content → border)
  - Margin = space *outside* border (border → next element)
- **Box Model (inside → out):**
  - Content → Padding → Border → Margin
- **Padding shorthand:**
  `padding: top right bottom left;`
- **Flexbox images:**  
  `display: flex;` → arranges items in a row by default
- **Set specific text color:**
  ```css
  .green { color: green; }
  ```

---

## JavaScript Basics
- **Arrow function**
  ```js
  const add = (a, b) => a + b;
  ```
- **Array map**
  ```js
  [1,2,3].map(x => x * 2); // [2,4,6]
  ```
- **getElementById + addEventListener**
  ```js
  document.getElementById("btn").addEventListener("click", () => console.log("Clicked!"));
  ```
- **querySelector**
  ```js
  document.querySelector("#id");
  ```
- **Change color**
  ```js
  document.getElementById("byu").style.color = "green";
  ```
- **Change text**
  ```js
  document.getElementById("bird").textContent = "crow";
  ```

---

## JS Syntax Examples
```js
if (x > 0) { ... } else { ... }
for (let i=0; i<3; i++) console.log(i); // 0,1,2
while (condition) { ... }
switch(value) { case 1: ...; break; }
```

- **Create object**
  ```js
  let person = { name: "Ben", age: 20 };
  ```
- **Add property**
  ```js
  person.job = "Developer";
  ```
- **Include JS in HTML**
  ```html
  <script src="script.js"></script>
  ```
- **Promise example**
  ```js
  Promise.resolve("done").then(res => console.log(res)); // done
  ```

---

##  DOM Notes
- DOM = Document Object Model (tree of nodes)
- JS can modify structure, content, and styles
- Changes appear instantly in browser

---

## JSON
- JSON = JavaScript Object Notation
- Text-based format for key-value data
  ```json
  { "name": "Alice", "age": 25 }
  ```

---

## Console / Terminal Commands

| Command | Description |
|----------|--------------|
| `pwd` | Print working directory |
| `cd` | Change directory |
| `ls` | List files |
| `ls -la` | Show all files (incl. hidden) with details |
| `mkdir` | Make directory |
| `mv` | Move or rename files |
| `rm` | Remove file |
| `chmod` | Change permissions |
| `man` | Show manual/help |
| `ps` | Show running processes |
| `ssh` | Remote shell session |
| `wget` | Download files |
| `vim` / `nano` | Text editors |
| `sudo` | Run command as superuser |

---

## DNS / HTTPS / Ports
- Example: `banana.fruit.bozo.click`
  - **TLD:** `.click`
  - **Root domain:** `bozo.click`
  - **Subdomains:** `fruit.bozo.click`, `banana.fruit.bozo.click`
- HTTPS requires a valid **SSL/TLS certificate**
- **DNS A record:** Points to IP address (not another A record)
- **Ports**
  - 80 → HTTP  
  - 443 → HTTPS  
  - 22 → SSH

---


