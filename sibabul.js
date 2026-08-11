
document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;


  // =====================================
  // READING PROGRESS BAR
  // =====================================

  const progress =
    document.createElement("div");

  progress.id =
    "reading-progress";

  document.body.prepend(progress);


  // =====================================
  // TOMBOL FITUR
  // =====================================

  const tools =
    document.createElement("div");

  tools.className =
    "reading-tools";

  tools.innerHTML = `

    <button
      id="font-minus"
      title="Perkecil teks">
      A−
    </button>

    <button
      id="font-plus"
      title="Perbesar teks">
      A+
    </button>

    <button
      id="focus-mode"
      title="Mode fokus">
      ◉
    </button>

    <button
      id="dark-mode"
      title="Mode gelap">
      ☾
    </button>

    <button
      id="top-btn"
      title="Kembali ke atas">
      ↑
    </button>

  `;

  document.body.appendChild(tools);


  // =====================================
  // AMBIL SEMUA PARAGRAF
  // =====================================

  const paragraphs = [
    ...document.querySelectorAll("main p")
  ];


  // =====================================
  // FONT SIZE
  // =====================================

  let fontSize =
    Number(
      localStorage.getItem(
        "sibabulFontSize"
      )
    ) || 21;


  // =====================================
  // DARK MODE YANG TERSIMPAN
  // =====================================

  const savedDark =
    localStorage.getItem(
      "sibabulDark"
    ) === "true";


  if (savedDark) {

    body.classList.add(
      "dark-mode"
    );

  }


  // =====================================
  // APPLY FONT SIZE
  // =====================================

  function applyFontSize() {

    paragraphs.forEach((p) => {

      p.style.fontSize =
        `${fontSize}px`;

    });


    localStorage.setItem(
      "sibabulFontSize",
      fontSize
    );

  }


  // =====================================
  // READING PROGRESS
  // =====================================

  function updateProgress() {

    const scrollTop =
      window.scrollY;


    const maxScroll =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    if (maxScroll > 0) {

      const percentage =
        (scrollTop / maxScroll) * 100;


      progress.style.width =
        `${percentage}%`;

    } else {

      progress.style.width =
        "0%";

    }

  }


  // =====================================
  // PARAGRAF YANG SEDANG DIBACA
  // =====================================

  function highlightReadingParagraph() {

    if (
      !body.classList.contains(
        "focus-mode"
      )
    ) {

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
        rect.top +
        rect.height / 2;


      const d =
        Math.abs(
          center - target
        );


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


  // =====================================
  // A+
  // =====================================

  document
    .getElementById("font-plus")
    .addEventListener(
      "click",
      () => {

        fontSize += 2;


        if (fontSize > 36) {

          fontSize = 36;

        }


        applyFontSize();

      }
    );


  // =====================================
  // A-
  // =====================================

  document
    .getElementById("font-minus")
    .addEventListener(
      "click",
      () => {

        fontSize -= 2;


        if (fontSize < 15) {

          fontSize = 15;

        }


        applyFontSize();

      }
    );


  // =====================================
  // DARK MODE
  // =====================================

  document
    .getElementById("dark-mode")
    .addEventListener(
      "click",
      () => {

        body.classList.toggle(
          "dark-mode"
        );


        localStorage.setItem(
          "sibabulDark",

          body.classList.contains(
            "dark-mode"
          )
        );

      }
    );


  // =====================================
  // FOCUS MODE
  // =====================================

  document
    .getElementById("focus-mode")
    .addEventListener(
      "click",
      () => {

        body.classList.toggle(
          "focus-mode"
        );


        highlightReadingParagraph();

      }
    );


  // =====================================
  // KEMBALI KE ATAS
  // =====================================

  document
    .getElementById("top-btn")
    .addEventListener(
      "click",
      () => {

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }
    );


  // =====================================
  // KLIK PARAGRAF
  // =====================================

  paragraphs.forEach((p) => {

    p.addEventListener(
      "click",
      () => {

        if (
          !body.classList.contains(
            "focus-mode"
          )
        ) {

          return;

        }


        paragraphs.forEach(
          (item) => {

            item.classList.remove(
              "reading-now"
            );

          }
        );


        p.classList.add(
          "reading-now"
        );

      }
    );

  });


  // =====================================
  // DOUBLE CLICK COPY TEKS ARAB
  // =====================================

  paragraphs.forEach((p) => {

    p.title =
      "Double-click untuk menyalin teks Arab";


    p.addEventListener(
      "dblclick",
      async () => {

        const text =
          p.innerText || "";


        const arabic =
          [...text]
            .filter((char) =>
              /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/
                .test(char)
            )
            .join("")
            .trim();


        if (!arabic) {

          return;

        }


        try {

          await navigator
            .clipboard
            .writeText(arabic);


          const oldTitle =
            p.title;


          p.title =
            "Teks Arab berhasil disalin ✓";


          setTimeout(() => {

            p.title =
              oldTitle;

          }, 1600);


        } catch (error) {

          const textarea =
            document.createElement(
              "textarea"
            );


          textarea.value =
            arabic;


          textarea.style.position =
            "fixed";


          textarea.style.opacity =
            "0";


          document.body.appendChild(
            textarea
          );


          textarea.select();


          try {

            document.execCommand(
              "copy"
            );

          } catch (e) {

            alert(
              "Browser tidak mengizinkan penyalinan otomatis."
            );

          }


          textarea.remove();

        }

      }
    );

  });


  // =====================================
  // KEYBOARD SHORTCUT
  //
  // + / =  → Perbesar
  // -      → Perkecil
  // D      → Dark Mode
  // F      → Focus Mode
  // Home   → Ke atas
  // =====================================

  document.addEventListener(
    "keydown",
    (e) => {

      if (
        e.target.matches(
          "input, textarea"
        )
      ) {

        return;

      }


      // -------------------------------
      // PERBESAR
      // -------------------------------

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


      // -------------------------------
      // PERKECIL
      // -------------------------------

      if (
        e.key === "-"
      ) {

        fontSize -= 2;


        if (fontSize < 15) {

          fontSize = 15;

        }


        applyFontSize();

      }


      // -------------------------------
      // DARK MODE
      // Tekan D
      // -------------------------------

      if (
        e.key.toLowerCase() === "d"
      ) {

        body.classList.toggle(
          "dark-mode"
        );


        localStorage.setItem(

          "sibabulDark",

          body.classList.contains(
            "dark-mode"
          )

        );

      }


      // -------------------------------
      // FOCUS MODE
      // Tekan F
      // -------------------------------

      if (
        e.key.toLowerCase() === "f"
      ) {

        body.classList.toggle(
          "focus-mode"
        );


        highlightReadingParagraph();

      }


      // -------------------------------
      // HOME
      // -------------------------------

      if (
        e.key === "Home"
      ) {

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }

    }
  );


  // =====================================
  // SCROLL
  // =====================================

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


  // =====================================
  // INISIALISASI
  // =====================================

  applyFontSize();

  updateProgress();

});

