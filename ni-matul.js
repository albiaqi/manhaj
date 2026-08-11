document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // ==============================
  // READING PROGRESS BAR
  // ==============================

  const progress = document.createElement("div");
  progress.id = "reading-progress";
  document.body.prepend(progress);


  // ==============================
  // TOMBOL FITUR MEMBACA
  // ==============================

  const tools = document.createElement("div");

  tools.className = "reading-tools";

  tools.innerHTML = `
    <button id="font-minus" title="Perkecil teks">A−</button>
    <button id="font-plus" title="Perbesar teks">A+</button>
    <button id="focus-mode" title="Mode fokus">◉</button>
    <button id="dark-mode" title="Mode gelap">☾</button>
    <button id="top-btn" title="Ke atas">↑</button>
  `;

  document.body.appendChild(tools);


  // ==============================
  // AMBIL ELEMENT
  // ==============================

  const arabicTexts = [
    ...document.querySelectorAll(".arabic-text")
  ];

  const paragraphs = [
    ...document.querySelectorAll("main p")
  ];


  // ==============================
  // SIMPAN PENGATURAN
  // ==============================

  let fontSize =
    Number(localStorage.getItem("niMatulFontSize")) || 21;

  const savedDark =
    localStorage.getItem("niMatulDark") === "true";


  if (savedDark) {
    body.classList.add("dark-mode");
  }


  // ==============================
  // UKURAN FONT ARAB
  // ==============================

  function applyFontSize() {

    arabicTexts.forEach((el) => {

      el.style.fontSize = `${fontSize}px`;

    });

    localStorage.setItem(
      "niMatulFontSize",
      fontSize
    );
  }


  // ==============================
  // READING PROGRESS
  // ==============================

  function updateProgress() {

    const scrollTop = window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (maxScroll > 0) {

      const percentage =
        (scrollTop / maxScroll) * 100;

      progress.style.width =
        `${percentage}%`;

    } else {

      progress.style.width = "0%";

    }
  }


  // ==============================
  // PARAGRAF YANG SEDANG DIBACA
  // ==============================

  function highlightReadingParagraph() {

    if (!body.classList.contains("focus-mode")) {
      return;
    }

    const target =
      window.innerHeight * 0.35;

    let closest = null;

    let distance = Infinity;


    paragraphs.forEach((p) => {

      const rect =
        p.getBoundingClientRect();

      const center =
        rect.top + rect.height / 2;

      const d =
        Math.abs(center - target);


      if (d < distance) {

        distance = d;

        closest = p;

      }

    });


    paragraphs.forEach((p) => {

      p.classList.remove(
        "reading-now"
      );

    });


    if (closest) {

      closest.classList.add(
        "reading-now"
      );

    }
  }


  // ==============================
  // TOMBOL A+
  // ==============================

  document
    .getElementById("font-plus")
    .addEventListener("click", () => {

      fontSize += 2;

      if (fontSize > 36) {
        fontSize = 36;
      }

      applyFontSize();

    });


  // ==============================
  // TOMBOL A-
  // ==============================

  document
    .getElementById("font-minus")
    .addEventListener("click", () => {

      fontSize -= 2;

      if (fontSize < 15) {
        fontSize = 15;
      }

      applyFontSize();

    });


  // ==============================
  // DARK MODE
  // ==============================

  document
    .getElementById("dark-mode")
    .addEventListener("click", () => {

      body.classList.toggle(
        "dark-mode"
      );


      localStorage.setItem(
        "niMatulDark",
        body.classList.contains(
          "dark-mode"
        )
      );

    });


  // ==============================
  // FOCUS MODE
  // ==============================

  document
    .getElementById("focus-mode")
    .addEventListener("click", () => {

      body.classList.toggle(
        "focus-mode"
      );

      highlightReadingParagraph();

    });


  // ==============================
  // KEMBALI KE ATAS
  // ==============================

  document
    .getElementById("top-btn")
    .addEventListener("click", () => {

      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    });


  // ==============================
  // KLIK PARAGRAF
  // ==============================

  paragraphs.forEach((p) => {

    p.addEventListener("click", () => {

      if (
        !body.classList.contains(
          "focus-mode"
        )
      ) {
        return;
      }


      paragraphs.forEach((item) => {

        item.classList.remove(
          "reading-now"
        );

      });


      p.classList.add(
        "reading-now"
      );

    });

  });


  // ==============================
  // KEYBOARD SHORTCUT
  // ==============================

  document.addEventListener(
    "keydown",
    (e) => {

      // Jangan jalankan shortcut
      // ketika sedang mengetik

      if (
        e.target.matches(
          "input, textarea"
        )
      ) {
        return;
      }


      // ==========================
      // TAMBAH FONT
      // ==========================

      if (
        e.key === "+" ||
        e.key === "="
      ) {

        fontSize += 2;

        if (fontSize > 36) {
          fontSize = 36;
        }

        applyFontSize();

      }


      // ==========================
      // KURANGI FONT
      // ==========================

      if (e.key === "-") {

        fontSize -= 2;

        if (fontSize < 15) {
          fontSize = 15;
        }

        applyFontSize();

      }


      // ==========================
      // DARK MODE
      // Tekan D
      // ==========================

      if (
        e.key.toLowerCase() === "d"
      ) {

        body.classList.toggle(
          "dark-mode"
        );


        localStorage.setItem(
          "niMatulDark",
          body.classList.contains(
            "dark-mode"
          )
        );

      }


      // ==========================
      // FOCUS MODE
      // Tekan F
      // ==========================

      if (
        e.key.toLowerCase() === "f"
      ) {

        body.classList.toggle(
          "focus-mode"
        );

        highlightReadingParagraph();

      }


      // ==========================
      // HOME
      // ==========================

      if (e.key === "Home") {

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }

    }
  );


  // ==============================
  // DOUBLE CLICK UNTUK COPY ARAB
  // ==============================

  arabicTexts.forEach((text) => {

    text.title =
      "Double-click untuk menyalin teks Arab";


    text.addEventListener(
      "dblclick",
      async () => {

        try {

          await navigator.clipboard
            .writeText(
              text.innerText
            );


          const oldTitle =
            text.title;


          text.title =
            "Teks Arab berhasil disalin ✓";


          setTimeout(() => {

            text.title =
              oldTitle;

          }, 1600);


        } catch (error) {

          alert(
            "Browser tidak mengizinkan penyalinan otomatis."
          );

        }

      }
    );

  });


  // ==============================
  // SAAT SCROLL
  // ==============================

  window.addEventListener(
    "scroll",
    () => {

      updateProgress();

      highlightReadingParagraph();

    },
    {
      passive: true
    }
  );


  // ==============================
  // JALANKAN SAAT PERTAMA
  // ==============================

  applyFontSize();

  updateProgress();

});